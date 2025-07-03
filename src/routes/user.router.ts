import express, { NextFunction, Request, Response } from 'express'
import { UserController } from '../controllers/user.controller'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAcess } from '../middlewares/canAccess'
import { Roles } from '../constant/application'
import userValidator from '../validators/user-validator'
import listUsersValidator from '../validators/list-users-validator'
const userRepo = AppDataSource.getRepository(User)
const userService: UserService = new UserService(userRepo, logger)
const userController: UserController = new UserController(userService, logger)
const router = express.Router()

router.post('/', userValidator, authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next)
)
router.delete('/:id', authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    userController.delete(req, res, next)
)
router.patch('/:id', authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    userController.update(req, res, next)
)
router.get('/', listUsersValidator, authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    userController.get(req, res, next)
)
router.get('/:id', authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) => userController.getById(req, res, next))

export default router
