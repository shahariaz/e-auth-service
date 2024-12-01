import express from 'express'
import { Auth } from '../controllers/auth.controller'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository, logger)
const auth = new Auth(userService, logger)
router.post('/register', (req, res, next) => auth.register(req, res, next))
export default router
