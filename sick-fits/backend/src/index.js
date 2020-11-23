const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const createServer = require('./createServer')

const server = createServer()

server.express.use(cookieParser())

// Decode JWT token
server.express.use((req, res, next) => {
  const { token } = req.cookies

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }
  next()
})

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
