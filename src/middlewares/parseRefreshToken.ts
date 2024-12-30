import { expressjwt } from 'express-jwt'
import { config } from '../config/config'
import { Request } from 'express'
import { AuthCookie } from '../types/types'

import logger from '../config/logger'

export default expressjwt({
    secret: config.SECRET_KEY!,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie
        logger.debug('New request to logout a user', {
            token: refreshToken
        })
        return refreshToken
    }
})
