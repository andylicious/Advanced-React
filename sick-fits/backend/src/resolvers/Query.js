const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')

const Query = {
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items()
  //   return items
  // },
  // ABOVE IS EQUAL TO BELOW
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null
    }

    const user = await ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    )

    return user
  },

  async users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in.')
    }

    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])

    return ctx.db.query.users({}, info)
  },
}

module.exports = Query
