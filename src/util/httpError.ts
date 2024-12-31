import { NextFunction, Request } from 'express'
import errorObject from './errorObject'

interface CustomError extends Error {
    status?: number
}

export default (nextFunc: NextFunction, err: CustomError, req: Request, errorSatausCode: number) => {
    errorSatausCode = errorSatausCode || err.status || 500
    const errorObj = errorObject(err, req, errorSatausCode)
    nextFunc(errorObj)
}
