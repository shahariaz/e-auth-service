import { Request } from 'express'
import { THttpErrorResponse } from '../types/types'
import responseMessage from '../constant/responseMessage'
import logger from '../config/logger'
import { config } from '../config/config'
import { EAplicationEnvironment } from '../constant/application'

export default (err: Error, req: Request, errorStatusCode: number) => {
    const errorObj: THttpErrorResponse = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage.ERROR,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    }
    //log
    logger.error(`CONTROLLER_ERROR`, {
        meta: errorObj
    })
    if (config.NODE_ENV === EAplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }
}
