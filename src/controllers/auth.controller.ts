import fs from 'fs'
import path from 'path'
import { NextFunction, Response } from 'express'
import httpResponse from '../util/httpResponse'
import { RegisterUserRequest } from '../types/interface'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { config } from '../config/config'

export class Auth {
    private privateKey: Buffer | null = null
    private publicKey: Buffer | null = null

    constructor(
        private userService: UserService,
        private logger: Logger
    ) {
        this.loadKeys()
        this.userService = userService
        this.logger = logger
    }

    private loadKeys() {
        try {
            this.privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'))
            this.publicKey = fs.readFileSync(path.join(__dirname, '../../certs/public.pem'))
        } catch (err) {
            this.logger.error('Error loading key files', err)
            throw new Error('Key files not found')
        }
    }

    public async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password, role } = req.body

            const result = validationResult(req)
            if (!result.isEmpty()) {
                return httpResponse(req, res, 400, 'Validation Error', result.array())
            }

            const user = await this.userService.createUser({ firstName, lastName, email, password, role })
            if (!this.privateKey) {
                throw createHttpError(500, 'Private key not available')
            }

            const payload = {
                sub: String(user.id),
                email: user.email,
                role: user.role
            }

            const accessToken = jwt.sign(payload, this.privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service'
            })

            const refreshToken = jwt.sign(payload, String(config.SECRET_KEY), {
                algorithm: 'HS256',
                expiresIn: '30d',
                issuer: 'auth-service'
            })

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
