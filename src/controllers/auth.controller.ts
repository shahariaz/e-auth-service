import { NextFunction, Response } from 'express'
import httpResponse from '../util/httpResponse'
import { RegisterUserRequest } from '../types/interface'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
// import jwt from 'jsonwebtoken'
export class Auth {
    userService: UserService
    constructor(
        userService: UserService,
        private logger: Logger
    ) {
        this.userService = userService
        this.logger = logger
    }
    public async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password, role } = req.body

            const result = validationResult(req)
            if (!result.isEmpty()) {
                return httpResponse(req, res, 400, 'Validation Error', result.array())
            }

            const user = await this.userService.createUser({ firstName, lastName, email, password, role })
            const accessToken = 'jdlkfjlafjsaf'
            const refreshToken = 'lkjfdoejlfjdlf'
            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                secure: false // Set to true if using HTTPS
            })
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: false // Set to true if using HTTPS
            })
            httpResponse(req, res, 201, 'User Registered Successfully', user)
        } catch (error) {
            next(error)
        }
    }
}
