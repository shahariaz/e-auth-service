import { Logger } from 'winston'
import { UserService } from '../services/UserService'

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger
    ) {}
    async getAllUsers() {}
}
