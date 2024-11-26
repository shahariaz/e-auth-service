import { Request, Response } from 'express'
import httpResponse from '../util/httpResponse'

export class Auth {
    public register(_: Request, res: Response) {
        httpResponse(_, res, 201, 'User Registered Successfully')
    }
}
