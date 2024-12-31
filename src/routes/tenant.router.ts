import express, { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import { TenantService } from '../services/TenantService'
import logger from '../config/logger'
import { TenantController } from '../controllers/tenant.controller'
const router = express.Router()

const tenantRepo = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepo, logger)
const tenant = new TenantController(tenantService, logger)
router.post('/', (req, res) => {
    res.status(201).send()
})
router.post('/create', (req: Request, res: Response, next: NextFunction) => tenant.createTenant(req, res, next))

export default router
