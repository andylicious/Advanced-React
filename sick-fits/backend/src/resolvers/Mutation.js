const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
}

module.exports = Mutations
