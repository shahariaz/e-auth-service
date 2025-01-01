import { Logger } from 'winston'
import { UserService } from '../services/UserService'
import { NextFunction, Response } from 'express'
import { CreateUserRequest, UserRole } from '../types/interface'
import httpResponse from '../util/httpResponse'
import { Roles } from '../constant/application'

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger
    ) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password, role = Roles.MANAGER as UserRole } = req.body

        this.logger.debug('New request to create a user', {
            firstName,
            lastName,
            email,
            password: '******'
        })

        try {
            const user = await this.userService.createUser({ firstName, lastName, email, password, role })

            this.logger.info('User has been created', { id: user.id })
            httpResponse(req, res, 201, 'User created', user)
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in create method', error)
                next(error)
            }
        }
    }
}
