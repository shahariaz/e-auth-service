import express from 'express'
import { Auth } from '../controllers/auth.controller'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/unbound-method
router.post('/register', Auth.prototype.register)
export default router
