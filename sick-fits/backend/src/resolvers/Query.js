const { forwardTo } = require('prisma-binding')

const Query = {
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items()
  //   return items
  // },
  // ABOVE IS EQUAL TO BELOW
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parnet, args, ctx, info) {
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
}

module.exports = Query
