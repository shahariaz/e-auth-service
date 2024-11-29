import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import { UserData } from '../types/interface'

export class UserService {
    async createUser({ firstName, lastName, email, password }: UserData) {
        const userRepo = AppDataSource.getRepository(User)
        await userRepo.save({ firstName, lastName, email, password })
    }
}
