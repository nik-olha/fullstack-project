import express from 'express'
import dotenv from 'dotenv'

import flowerRouter from './routers/flowers'
import userRouter from './routers/user'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'


dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.use(apiContentType)
// Use common 3rd-party middlewares
app.use(express.json())

// Use flower router
app.use('/flowers', flowerRouter)

// Use user router
app.use('/user', userRouter)

// Custom API error handler
app.use(apiErrorHandler)


export default app
