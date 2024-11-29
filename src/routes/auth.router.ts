import express from 'express'
import { Auth } from '../controllers/auth.controller'
import { UserService } from '../services/UserService'
const router = express.Router()
const userService = new UserService()
const auth = new Auth(userService)
router.post('/register', (req, res) => auth.register(req, res))
export default router
