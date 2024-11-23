import express, { NextFunction, Request, Response } from 'express'

import logger from './config/logger'
import { HttpError } from 'http-errors'
const app = express()

app.get('/', (_, res) => {
    res.send('Welcome to Auth Service!')
})
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
