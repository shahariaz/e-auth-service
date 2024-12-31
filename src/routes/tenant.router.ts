import express, { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import { TenantService } from '../services/TenantService'
import logger from '../config/logger'
import { TenantController } from '../controllers/tenant.controller'
import authenticate from '../middlewares/authenticate'
import { canAcess } from '../middlewares/canAccess'
import { Roles } from '../constant/application'
import tenantValidator from '../validators/tenant-validator'
const router = express.Router()

const tenantRepo = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepo, logger)
const tenant = new TenantController(tenantService, logger)
router.post('/', (req, res) => {
    res.status(201).send()
})
router.post('/create', tenantValidator, authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    tenant.createTenant(req, res, next)
)
router.get('/getall', tenantValidator, authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    tenant.getTenant(req, res, next)
)
router.get('/get-tenent/:id', authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    tenant.getTenantById(req, res, next)
)
router.delete('/delete-tenent/:id', authenticate, canAcess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
    tenant.deleteById(req, res, next)
)

export default router
