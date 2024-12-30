import { expressjwt } from 'express-jwt'
import { config } from '../config/config'
import { Request } from 'express'
import { AuthCookie } from '../types/types'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { Jwt } from 'jsonwebtoken'

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
    },
    async isRevoked(_req: Request, token?: Jwt): Promise<boolean> {
        try {
            logger.debug('New request to logout a user', {
                token: token
            })
            if (!token || typeof token.payload !== 'object' || !('id' in token.payload) || !('sub' in token.payload)) {
                return true // Assume revoked if token is invalid
            }

            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)

            // Convert payload.id and payload.sub to numbers, if applicable
            const payload = token.payload as { id: string; sub: string }
            const tokenId = Number(payload.id)
            const userId = Number(payload.sub)

            if (isNaN(tokenId) || isNaN(userId)) {
                return true // Invalid token data
            }

            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    id: tokenId,
                    user: { id: userId }
                }
            })

            return !refreshToken // Token is revoked if not found
        } catch (error) {
            logger.error('Error in isRevoked:', error) // Log the error for debugging
            return true // Assume revoked on error
        }
    }
})
