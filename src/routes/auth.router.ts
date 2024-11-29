import express from 'express'
import { Auth } from '../controllers/auth.controller'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const auth = new Auth(userService)
router.post('/register', (req, res) => auth.register(req, res))
export default router
