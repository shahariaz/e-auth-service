import { Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'

interface UserData {
    firstName: string
    lastName: string
    email: string
    password: string
}
interface RegisterUserRequest extends Request {
    body: UserData
}
export class Auth {
    public async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body

        const userRepo = AppDataSource.getRepository(User)
        await userRepo.save({ firstName, lastName, email, password })

        httpResponse(req, res, 201, 'User Registered Successfully')
    }
}
