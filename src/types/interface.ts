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
    role?: UserRole
}
interface RegisterUserRequest extends Request {
    body: UserData
}
interface AuthRequest extends Request {
    auth: {
        sub: string
        role: string
        id?: string
    }
}
export interface ITenant {
    name: string
    address: string
}
export { RegisterUserRequest, UserData, AuthRequest }
