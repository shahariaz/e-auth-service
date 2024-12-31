import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../types/interface'
import responseMessage from '../constant/responseMessage'
import httpResponse from '../util/httpResponse'

export const canAcess = (role: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest
        if (role.includes(_req.auth.role)) {
            next()
        } else {
            httpResponse(req, res, 403, responseMessage.FORBIDDEN)
        }
    }
}
