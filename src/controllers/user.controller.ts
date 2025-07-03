import { Logger } from 'winston'
import { UserService } from '../services/UserService'
import { NextFunction, Response } from 'express'
import { CreateUserRequest, UserRole } from '../types/interface'
import httpResponse from '../util/httpResponse'
import { Roles } from '../constant/application'
import { matchedData, validationResult } from 'express-validator'

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger
    ) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return httpResponse(req, res, 400, 'Validation Error', result.array())
        }
        const { firstName, lastName, email, password, role = Roles.MANAGER as UserRole, tenantId } = req.body

        this.logger.debug('New request to create a user', {
            firstName,
            lastName,
            email,
            password: '******'
        })

        try {
            const user = await this.userService.createUser({ firstName, lastName, email, password, role, tenantId })

            this.logger.info('User has been created', { id: user.id })
            httpResponse(req, res, 201, 'User created', user)
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in create method', error)
                next(error)
            }
        }
    }
    async delete(req: CreateUserRequest, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            const isDeleted = await this.userService.deleteUser(Number(id))
            if (!isDeleted) {
                return httpResponse(req, res, 404, 'User not found')
            }
            httpResponse(req, res, 200, 'User deleted')
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in delete method', error)
                next(error)
            }
        }
    }
    async update(req: CreateUserRequest, res: Response, next: NextFunction) {
        // const result = validationResult(req)
        // if (!result.isEmpty()) {
        //     return httpResponse(req, res, 400, 'Validation Error', result.array())
        // }
        const { firstName, lastName, email, password, role = Roles.MANAGER as UserRole } = req.body
        const id = req.params.id
        this.logger.debug('New request to update a user', {
            firstName,
            lastName,
            email,
            password: '******'
        })
        try {
            const user = await this.userService.updateUser(Number(id), { firstName, lastName, email, password, role })
            if (!user) {
                return httpResponse(req, res, 404, 'User not found')
            }
            this.logger.info('User has been updated', { id })
            httpResponse(req, res, 200, 'User updated', user)
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in update method', error)
                next(error)
            }
        }
    }
    async get(req: CreateUserRequest, res: Response, next: NextFunction) {
        const validatedQuery = matchedData(req, { onlyValidData: true })
        try {
            const [users, count] = await this.userService.getAll(validatedQuery)
            httpResponse(req, res, 200, 'Users', {
                currentpage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                total: count,
                totalPages: Math.ceil(count / (validatedQuery.perPage as number)),
                data: users
            })
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in get method', error)
                next(error)
            }
        }
    }
    async getById(req: CreateUserRequest, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            const user = await this.userService.findById(Number(id))
            if (!user) {
                return httpResponse(req, res, 404, 'User not found')
            }
            httpResponse(req, res, 200, 'User', user)
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in getById method', error)
                next(error)
            }
        }
    }
}
