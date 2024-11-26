import express from 'express'
import { Auth } from '../controllers/auth.controller'
const router = express.Router()
const auth = new Auth()
router.post('/register', (req, res) => auth.register(req, res))
export default router
