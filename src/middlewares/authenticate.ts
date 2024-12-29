import { expressjwt, GetVerificationKey } from 'express-jwt'
import JwksClient from 'jwks-rsa'
import { config } from '../config/config'
import { Request } from 'express'
export default expressjwt({
    secret: JwksClient.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config.JWKS_URI!
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.split(' ')[1] !== undefined) {
            const token = authHeader.split(' ')[1]
            if (token) {
                return token
            }
        }
        type AuthCookie = {
            accessToken: string
        }
        const { accessToken } = req.cookies as AuthCookie
        return accessToken
    }
})
