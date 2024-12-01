import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types/interface'
import createHttpError from 'http-errors'
import { Logger } from 'winston'

export class UserService {
    constructor(
        private userRepository: Repository<User>,
        private logger: Logger
    ) {
        this.userRepository = userRepository
        this.logger = logger
    }
    async createUser({ firstName, lastName, email, password }: UserData) {
        try {
            const user = await this.userRepository.save({ firstName, lastName, email, password })
            this.logger.info('User Created Successfully', user.id)
            return user
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(500, 'Faild to Store data in database')
            throw error
        }
    }
}
