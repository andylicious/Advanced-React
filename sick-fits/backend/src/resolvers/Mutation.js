const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { createEmail, transport } = require('../mail')

const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if logged in
    const item = await context.db.mutation.createItem(
      {
        data: { ...args },
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

  async deleteItem(parent, args, context, info) {
    const where = { id: args.id }
    // 1. Find item
    const item = await context.db.query.item({ where }, `{ id title }`)
    // 2. Check if they own and have permissions
    // 3. Delete it
    return context.db.mutation.deleteItem({ where }, info)
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
}

module.exports = Mutations
