import { Request } from 'express'
export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin'
}
interface UserData {
    firstName: string
    lastName: string
    email: string
    password: string
    role: UserRole
}
interface RegisterUserRequest extends Request {
    body: UserData
}

export { RegisterUserRequest, UserData }
