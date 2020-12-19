const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { hasPermission } = require('../utils')
const { createEmail, transport } = require('../mail')
const { connect } = require('net')
const stripe = require('../stripe')

const Mutations = {
  async createItem(parent, args, context, info) {
    if (!context.request.userId) {
      throw new Error('You need to be logged in to do that')
    }

    const item = await context.db.mutation.createItem(
      {
        data: { ...args, user: { connect: { id: context.request.userId } } },
      },
      info
    )

    return item
  },

  async updateItem(parent, args, context, info) {
    const updates = { ...args }
    delete updates.id
    return context.db.mutation.updateItem(
      {
        data: { ...updates },
        where: { id: args.id },
      },
      info
    )
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    // 1. Find item
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`)
    // 2. Check if they own and have permissions
    const ownsItem = item.user.id === ctx.request.userId
    const hasDeletePermissions = ctx.request.user.permissions.some(
      (permission) => ['ADMIN', 'ITEMDELETE'].includes(permission)
    )

    if (!ownsItem && !hasDeletePermissions) {
      throw new Error('You do not have permission to delete this item.')
    }
    // 3. Delete it
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async signup(parent, args, context, info) {
    const email = args.email.toLowerCase()
    const password = await bcrypt.hash(args.password, 10)

    const user = await context.db.mutation.createUser(
      {
        data: {
          ...args,
          email,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    )

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year token
    })

    return user
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } })

    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new Error(`Username or password incorrect`)
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })

    return user
  },

  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: 'Signed out' }
  },

  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } })

    if (!user) {
      throw new Error(`No such user found for email ${args.email}`)
    }

    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1hr
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    })
    const mailRepsonse = await transport.sendMail({
      from: 'andreasmann94@gmail.com',
      to: user.email,
      subject: 'Reset your password',
      html: createEmail(
        `Your password reset link ishere \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset!</a>`
      ),
    })

    return { message: 'Thanks!' }
  },

  async resetPassword(
    parent,
    { resetToken, password, confirmPassword },
    ctx,
    info
  ) {
    if (password !== confirmPassword) {
      throw new Error('Paswords do not match')
    }

    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gte: Date.now() - 3600000 },
    })

    if (!user) {
      throw new Error('Token expired or invalid')
    }

    const newPassword = await bcrypt.hash(password, 10)

    const updateUser = await ctx.db.mutation.updateUser(
      {
        where: {
          email: user.email,
        },
        data: {
          password: newPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      },
      info
    )

    const token = jwt.sign({ userId: updateUser.id }, process.env.APP_SECRET)

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year token
    })

    return updateUser
  },

  async updatePermissions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('Must be logged in!')
    }

    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    )

    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
    console.log({ permissions: args.permissions })

    return ctx.db.mutation.updateUser(
      {
        data: { permissions: { set: args.permissions } },
        where: { id: args.id },
      },
      info
    )
  },

  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request
    if (!userId) {
      throw new Error('Must be logged in!')
    }

    const [existingCartItem] = await ctx.db.query.cartItems(
      {
        where: {
          user: { id: userId },
          item: { id: args.id },
        },
      },
      info
    )

    if (existingCartItem) {
      console.log('Item already in cart')
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      })
    }

    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: { connect: { id: userId } },
          item: { connect: { id: args.id } },
        },
      },
      info
    )
  },

  async removeFromCart(parent, args, ctx, info) {
    const { userId } = ctx.request
    if (!userId) {
      throw new Error('Must be logged in!')
    }

    const cartItem = await ctx.db.query.cartItem(
      {
        where: { id: args.id },
      },
      `{ id, user { id } }`
    )

    if (!cartItem) {
      throw new Error('No item found.')
    }

    if (cartItem.user.id !== userId) {
      throw new Error('Item not owned by user.')
    }

    return ctx.db.mutation.deleteCartItem(
      {
        where: { id: args.id },
      },
      info
    )
  },

  async createOrder(parent, args, ctx, info) {
    // 1. Query the current user and make sure they are signed in
    const { userId } = ctx.request
    if (!userId)
      throw new Error('You must be signed in to complete this order.')
    const user = await ctx.db.query.user(
      { where: { id: userId } },
      `{
      id
      name
      email
      cart {
        id
        quantity
        item { title price id description image largeImage }
      }}`
    )
    // 2. recalculate the total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0
    )
    console.log(`Going to charge for a total of ${amount}`)
    // 3. Create the stripe charge (turn token into $$$)
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token,
    })
    // 4. Convert the CartItems to OrderItems
    const orderItems = user.cart.map((cartItem) => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      }
      delete orderItem.id
      return orderItem
    })

    // 5. create the Order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } },
      },
    })
    // 6. Clean up - clear the users cart, delete cartItems
    const cartItemIds = user.cart.map((cartItem) => cartItem.id)
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds,
      },
    })
    // 7. Return the Order to the client
    return order
    // 5. create the Order
    // 6. Clean up - clear the users cart, delete cartItems
    // 7. Return the Order to the client
  },
}

module.exports = Mutations
