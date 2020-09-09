require('dotenv').config()
const createServer = require('./createServer')

const server = createServer()

// TODO: Use express middleware to handle cookies (JWT)
// TODO: Use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
    port: process.env.PORT,
  },
  (details) =>
    console.log(`Server now running on: https://localhost:${details.port}`)
)
