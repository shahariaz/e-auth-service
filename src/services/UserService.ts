import { Brackets, Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData, UserQueryParams } from '../types/interface'
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
    async createUser({ firstName, lastName, email, password, role, tenantId }: UserData) {
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
            const user = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined
            })
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
            where: { id },
            relations: {
                tenant: true
            }
        })
        if (!user) {
            const error = createHttpError(404, 'User not found')
            throw error
        }
        return user
    }
    async deleteUser(id: number) {
        await this.userRepository.delete(id)
        return true
    }
    async getAll(validatedQuery: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder('user')

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where("CONCAT(user.firstName, ' ', user.lastName) ILike :q", { q: searchTerm }).orWhere('user.email ILike :q', {
                        q: searchTerm
                    })
                })
            )
        }

        if (validatedQuery.role) {
            queryBuilder.andWhere('user.role = :role', {
                role: validatedQuery.role
            })
        }

        const result = await queryBuilder
            .skip((validatedQuery.currentPage! - 1) * validatedQuery.perPage!)
            .take(validatedQuery.perPage)
            .orderBy('user.id', 'DESC')
            .getManyAndCount()

        return result
    }
    async updateUser(id: number, data: UserData) {
        const user = await this.userRepository.findOne({
            where: { id }
        })
        if (!user) {
            const error = createHttpError(404, 'User not found')
            throw error
        }
        const updatedUser = await this.userRepository.update(id, data)
        return updatedUser
    }
}
