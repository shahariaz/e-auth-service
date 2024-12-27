import fs from 'fs'
import path from 'path'
import { NextFunction, Response } from 'express'
import httpResponse from '../util/httpResponse'
import { RegisterUserRequest } from '../types/interface'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { config } from '../config/config'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { TokenService } from '../services/TokenService'

export class Auth {
    private privateKey: Buffer | null = null

    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService
    ) {
        this.loadKeys()
        this.userService = userService
        this.logger = logger
    }

    private loadKeys() {
        try {
            this.privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'))
        } catch (err) {
            this.logger.error('Error loading key files', err)
            throw new Error('Key files not found')
        }
    }

    public async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password, role } = req.body
            this.logger.debug('New request to register a user', {
                firstName,
                lastName,
                email,
                password: '******'
            })
            const result = validationResult(req)
            if (!result.isEmpty()) {
                return httpResponse(req, res, 400, 'Validation Error', result.array())
            }

            const user = await this.userService.createUser({ firstName, lastName, email, password, role })
            this.logger.info('User has been registered', { id: user.id })
            if (!this.privateKey) {
                throw createHttpError(500, 'Private key not available')
            }

            const payload = {
                sub: String(user.id),
                email: user.email,
                role: user.role
            }

            const accessToken = this.tokenService.generateAccessToken(payload, this.privateKey)
            // Persist The refresh Token
            const MS_IN_A_MONTH = 1000 * 60 * 60 * 24 * 30
            const refreshRepo = AppDataSource.getRepository(RefreshToken)
            const newRefreshToken = await refreshRepo.save({
                expiresAt: new Date(Date.now() + MS_IN_A_MONTH),
                user
            })
            const refreshToken = this.tokenService.genarateRefreshToken(payload, String(config.SECRET_KEY), newRefreshToken.id.toString())

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            })

            httpResponse(req, res, 201, 'User Registered Successfully', user)
        } catch (error) {
            this.logger.error('Error in register method', error)
            next(error)
        }
    }
}
