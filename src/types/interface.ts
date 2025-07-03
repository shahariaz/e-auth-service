import { Request } from 'express'
export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    MANAGER = 'manager',
    SELLER = 'seller',
    GUEST = 'guest'
}
interface UserData {
    firstName: string
    lastName: string
    email: string
    password: string
    role?: UserRole
    tenantId?: number
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
export interface CreateUserRequest extends Request {
    body: UserData
}
export interface UserQueryParams {
    perPage?: number
    currentPage?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
}
export { RegisterUserRequest, UserData, AuthRequest }
