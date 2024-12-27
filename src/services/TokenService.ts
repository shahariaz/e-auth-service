import jwt from 'jsonwebtoken'
export class TokenService {
    generateAccessToken(payload: Record<string, string>, privateKey: Buffer): string {
        const acessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service'
        })
        return acessToken
    }
    genarateRefreshToken(payload: Record<string, string>, secretKey: string, newRefreshToken: string): string {
        const refreshToken = jwt.sign(payload, secretKey, {
            algorithm: 'HS256',
            expiresIn: '30d',
            issuer: 'auth-service',
            jwtid: newRefreshToken
        })
        return refreshToken
    }
}
