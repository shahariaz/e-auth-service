import { Request, Response } from 'express'
import { THttpResponse } from '../types/types'
import logger from '../config/logger'
import { config } from '../config/config'
import { EAplicationEnvironment } from '../constant/application'

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null) => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip,
            method: req.method,
            url: req.url
        },
        message: responseMessage,
        data
    }
    logger.info(`CONTROLLER_RESPONSE`, {
        meta: response
    })
    if (config.NODE_ENV === EAplicationEnvironment.PRODUCTION) {
        delete response.request.ip
    }
    res.status(responseStatusCode).json(response)
}
