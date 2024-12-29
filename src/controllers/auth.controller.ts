import { NextFunction, Response, Request } from 'express'
import httpResponse from '../util/httpResponse'
import { AuthRequest, RegisterUserRequest } from '../types/interface'
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
            this.logger.info('User has been Registerd ', { id: user.id })

            httpResponse(req, res, 201, 'User Registered Successfully', { ...user, password: undefined })
        } catch (error) {
            this.logger.error('Error in register method', error)
            next(error)
        }
    }
    public async Login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) {
                return httpResponse(req, res, 400, 'Validation Error', result.array())
            }
            const { email, password } = req.body as { email: string; password: string }
            this.logger.debug('New request to login a user', {
                email,
                password: '******'
            })
            const user = await this.userService.getUserByEmail(email)
            if (!user) {
                return httpResponse(req, res, 401, 'Invalid Credentials')
            }
            const isValidPassword = await this.userService.comparePassword(password, user.password)
            if (!isValidPassword) {
                return httpResponse(req, res, 401, 'Invalid Credentials')
            }
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
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60,
                httpOnly: true
            })
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            })
            this.logger.info('User has been logged in', { id: user.id })
            httpResponse(req, res, 200, 'User Logged In Successfully', { ...user, password: undefined })
        } catch (error) {
            this.logger.error('Error in login method', error)
            next(error)
        }
    }
    public async self(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const authUser = req.auth
            this.logger.debug('New request to get user details', {
                id: authUser.sub
            })
            const user = await this.userService.findById(Number(authUser.sub))
            httpResponse(req, res, 200, 'User Details', { ...user, password: undefined })
        } catch (error) {
            this.logger.error('Error in self method', error)
            next(error)
        }
    }
}
