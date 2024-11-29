import { Response } from 'express'
import httpResponse from '../util/httpResponse'

import { RegisterUserRequest } from '../types/interface'
import { UserService } from '../services/UserService'

export class Auth {
    userService: UserService
    constructor(userService: UserService) {
        this.userService = userService
    }
    public async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body
        const user = await this.userService.createUser({ firstName, lastName, email, password })
        httpResponse(req, res, 201, 'User Registered Successfully', user)
    }
}
