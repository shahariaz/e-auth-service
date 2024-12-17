import { NextFunction, Response } from 'express'
import httpResponse from '../util/httpResponse'
import { RegisterUserRequest } from '../types/interface'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'

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

            const user = await this.userService.createUser({ firstName, lastName, email, password, role })

            httpResponse(req, res, 201, 'User Registered Successfully', user)
        } catch (error) {
            next(error)
        }
    }
}
