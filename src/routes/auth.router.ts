import express from 'express'
import { Auth } from '../controllers/auth.controller'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import { NextFunction, Response, Request } from 'express'
import registerValidator from '../validators/register-validator'
import { TokenService } from '../services/TokenService'
import loginValidator from '../validators/login-validator'
import authenticate from '../middlewares/authenticate'
import { AuthRequest } from '../types/interface'
import validateRefreshToken from '../middlewares/validateRefreshToken'
import parseRefreshToken from '../middlewares/parseRefreshToken'
const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository, logger)
const tokenService = new TokenService()
const auth = new Auth(userService, logger, tokenService)

// const console = (req: Request, res: Response, next: NextFunction) => {
//     logger.info('logging request')
//     next()
// }

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) => auth.register(req, res, next))
export default router
router.post('/login', loginValidator, (req: Request, res: Response, next: NextFunction) => auth.Login(req, res, next))
router.get('/self', authenticate, (req: Request, res: Response, next: NextFunction) => auth.self(req as AuthRequest, res, next))
router.post('/refresh', validateRefreshToken, (req: Request, res: Response, next: NextFunction) => auth.refresh(req as AuthRequest, res, next))
router.post('/logout', authenticate, parseRefreshToken, (req: Request, res: Response, next: NextFunction) =>
    auth.logout(req as AuthRequest, res, next)
)
