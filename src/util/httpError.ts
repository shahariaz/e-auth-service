import { NextFunction, Request } from 'express'
import errorObject from './errorObject'

export default (nextFunc: NextFunction, err: Error, req: Request, errorSatausCode: number = 500) => {
    const errorObj = errorObject(err, req, errorSatausCode)
    nextFunc(errorObj)
}
