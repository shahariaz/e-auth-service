import express, { NextFunction, Request, Response } from 'express'
import { UserController } from '../controllers/user.controller'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAcess } from '../middlewares/canAccess'
import { Roles } from '../constant/application'
const userRepo = AppDataSource.getRepository(User)
const userService: UserService = new UserService(userRepo, logger)
const userController: UserController = new UserController(userService, logger)
const router = express.Router()

router.post('/', authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) => userController.create(req, res, next))

export default router
