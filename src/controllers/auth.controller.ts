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
    private setAccessToken_And_refreshTokenCookie(res: Response, next: NextFunction, accessToken: string, refreshToken: string) {
        try {
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
        } catch (error) {
            this.logger.error('Error in setAccessToken_And_refreshTokenCookie method', error)
            next(error)
        }
    }

    public async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password } = req.body
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

            const user = await this.userService.createUser({ firstName, lastName, email, password })
            this.logger.info('User has been registered', { id: user.id })

            const payload = {
                sub: String(user.id),
                email: user.email,
                role: user.role
            }

            const accessToken = this.tokenService.generateAccessToken(payload)
            const newRefreshToken = await this.tokenService.presistRefreshToken(user)
            const refreshToken = this.tokenService.genarateRefreshToken({ ...payload, id: newRefreshToken.id })
            // Set the access token and refresh token in the cookie
            this.setAccessToken_And_refreshTokenCookie(res, next, accessToken, refreshToken)
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
            // Set the access token and refresh token in the cookie
            this.setAccessToken_And_refreshTokenCookie(res, next, accessToken, refreshToken)
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
    public async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload = {
                sub: req.auth.sub,
                role: req.auth.role
            }
            const user = await this.userService.findById(Number(req.auth.sub))
            const accessToken = this.tokenService.generateAccessToken(payload)
            const newRefreshToken = await this.tokenService.presistRefreshToken(user)
            //Deleting the old refresh token from the database
            await this.tokenService.deleteRefreshToken(Number(req.auth.id!))
            const refreshToken = this.tokenService.genarateRefreshToken({ ...payload, id: newRefreshToken.id })

            // Set the access token and refresh token in the cookie
            this.setAccessToken_And_refreshTokenCookie(res, next, accessToken, refreshToken)
            this.logger.info('Refresh Token Has Been Verfied ', { id: req.auth.sub })
            const response = {
                UserId: req.auth.sub
            }
            httpResponse(req, res, 201, 'New AcessToken Genarated Successfully', response)
        } catch (error) {
            this.logger.error('Error in refresh method controller', error)
            next(error)
        }
    }
    public async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (isNaN(Number(req.auth.id))) {
                return httpResponse(req, res, 400, 'Invalid User Id')
            }
            const auth = req.auth

            await this.tokenService.deleteRefreshToken(Number(auth.id))

            res.clearCookie('accessToken', {
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            })
            res.clearCookie('refreshToken', {
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            })
            this.logger.info('User has been logged out', { id: req.auth.sub })
            httpResponse(req, res, 200, 'User Logged Out Successfully')
        } catch (error) {
            this.logger.error('Error in logout method', error)
            next(error)
        }
    }
}
