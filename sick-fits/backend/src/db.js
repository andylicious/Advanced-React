// Connects to the remote Prisma DB and gives us the
// ability to query it wih JS.
const { Prisma } = require('prisma-binding')

const db = () => {
  console.log('process.env', { env: process.env.PRISMA_ENDPOINT })
  return new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: true,
  })
}

module.exports = db
