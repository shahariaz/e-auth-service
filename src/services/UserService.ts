import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types/interface'

export class UserService {
    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository
    }
    async createUser({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.save({ firstName, lastName, email, password })
        return user
    }
}
