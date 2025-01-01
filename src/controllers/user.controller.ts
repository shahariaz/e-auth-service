/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from 'winston'
import { UserService } from '../services/UserService'
import { NextFunction, Request, Response } from 'express'

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger
    ) {}
    async create(req: Request, res: Response, next: NextFunction) {}
}
