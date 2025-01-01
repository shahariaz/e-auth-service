import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types/interface'
import createHttpError from 'http-errors'
import { Logger } from 'winston'
import bcrypt from 'bcrypt'
export class UserService {
    constructor(
        private userRepository: Repository<User>,
        private logger: Logger
    ) {
        this.userRepository = userRepository
        this.logger = logger
    }
    async createUser({ firstName, lastName, email, password, role }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email }
        })

        if (user) {
            const error = createHttpError(400, 'User Already Exists')
            throw error
        }
        //Hash the password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        try {
            const user = await this.userRepository.save({ firstName, lastName, email, password: hashedPassword, role })
            this.logger.info('User has been created', { id: user.id })
            return user
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(500, 'Faild to Store data in database')
            throw error
        }
    }
    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email }
        })
        if (!user) {
            const error = createHttpError(404, 'User not found')
            throw error
        }
        return user
    }
    async comparePassword(password: string, userPassword: string) {
        const isMatch = await bcrypt.compare(password, userPassword)
        return isMatch
    }
    async findById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id }
        })
        if (!user) {
            const error = createHttpError(404, 'User not found')
            throw error
        }
        return user
    }
}
