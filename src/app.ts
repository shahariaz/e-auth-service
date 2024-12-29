import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import authRoute from './routes/auth.router'
import logger from './config/logger'
import { HttpError } from 'http-errors'
import httpResponse from './util/httpResponse'
import cookieParser from 'cookie-parser'
const app = express()

app.get('/', (_, res) => {
    httpResponse(_, res, 200, 'Hello to Auth-Services')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//Routes
app.use('/auth', authRoute)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || 500
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
