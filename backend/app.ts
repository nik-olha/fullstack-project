import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { jwtStrategy } from './config/passport'
import passport from 'passport'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import flowerRouter from './routers/flowers'
import userRouter from './routers/user'
import orderLineRouter from './routers/orderlne'
import orderRouter from './routers/order'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.use(apiContentType)
// Use common 3rd-party middlewares
app.use(express.json())
app.use(cors())

passport.use(jwtStrategy)

// Use flower router
app.use('/flowers', flowerRouter)

// Use user router
app.use('/user', userRouter)

// Use orderline router
app.use('/orderLines', orderLineRouter)

// Use orders router
app.use('/orders', orderRouter)


// Custom API error handler
app.use(apiErrorHandler)

export default app
