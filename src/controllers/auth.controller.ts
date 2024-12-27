import { NextFunction, Response } from 'express'
import httpResponse from '../util/httpResponse'
import { RegisterUserRequest } from '../types/interface'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { TokenService } from '../services/TokenService'

export class Auth {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService
    ) {
        this.userService = userService
        this.logger = logger
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

            const payload = {
                sub: String(user.id),
                email: user.email,
                role: user.role
            }

            const accessToken = this.tokenService.generateAccessToken(payload)
            const newRefreshToken = await this.tokenService.presistRefreshToken(user)
            const refreshToken = this.tokenService.genarateRefreshToken({ ...payload, id: newRefreshToken.id })

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
