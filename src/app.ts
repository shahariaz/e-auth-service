/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import authRoute from './routes/auth.router'
import userRouter from './routes/user.router'
import tenantRoute from './routes/tenant.router'
import logger from './config/logger'
import globalErrorHandler from './middlewares/globalErrorHandler'
import { HttpError } from 'http-errors'
import httpResponse from './util/httpResponse'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.get('/', (_, res) => {
    httpResponse(_, res, 200, 'Hello to Auth-Services')
})
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5172',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    })
)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//Routes
app.use('/auth', authRoute)
app.use('/tenant', tenantRoute)
app.use('/user', userRouter)

// app.use(globalErrorHandler)
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || err.status || 500
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: ''
            }
        ]
    })
})
export default app
