import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from '../config/config'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { User } from '../entity/User'

import createHttpError from 'http-errors'
export class TokenService {
    generateAccessToken(payload: JwtPayload): string {
        const privateKey = config.private_key
        if (!privateKey) {
            throw createHttpError(500, 'Private key not available')
        }

        const acessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service'
        })
        return acessToken
    }
    genarateRefreshToken(payload: JwtPayload): string {
        const refreshToken = jwt.sign(payload, String(config.SECRET_KEY), {
            algorithm: 'HS256',
            expiresIn: '30d',
            issuer: 'auth-service',
            jwtid: String(payload.id)
        })
        return refreshToken
    }
    presistRefreshToken(user: User): Promise<RefreshToken> {
        const store = async () => {
            // Persist The refresh Token
            const MS_IN_A_MONTH = 1000 * 60 * 60 * 24 * 30
            const refreshRepo = AppDataSource.getRepository(RefreshToken)
            const newRefreshToken = await refreshRepo.save({
                expiresAt: new Date(Date.now() + MS_IN_A_MONTH),
                user
            })
            return newRefreshToken
        }
        return store()
    }
    deleteRefreshToken(id: number) {
        const deleteToken = async () => {
            const refreshRepo = AppDataSource.getRepository(RefreshToken)
            await refreshRepo.delete({ id: id })
        }
        return deleteToken()
    }
}
