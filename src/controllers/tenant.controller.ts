import { Request, Response, NextFunction } from 'express'
import { Logger } from 'winston'
import { TenantService } from '../services/TenantService'
import { ITenant } from '../types/interface'
import httpResponse from '../util/httpResponse'
import httpError from '../util/httpError'
import { validationResult } from 'express-validator'
export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger
    ) {}
    async createTenant(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return httpResponse(req, res, 400, 'Validation Error', result.array())
        }
        try {
            const { name, address } = req.body as ITenant
            const tenant = await this.tenantService.create({ name, address })
            this.logger.info('Tenant created', { id: tenant.id })
            httpResponse(req, res, 201, 'Tenant created', tenant)
        } catch (error) {
            if (error instanceof Error) {
                {
                    httpError(next, error, req, 500)
                }
            }
            this.logger.error('Error in createTenant method', error)
        }
    }
    async getTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll()
            this.logger.info('Get all tenants')
            httpResponse(req, res, 200, 'Tenants', tenants)
        } catch (error) {
            if (error instanceof Error) {
                {
                    httpError(next, error, req, 500)
                }
            }
            this.logger.error('Error in getTenant method', error)
        }
    }
    async getTenantById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const tenant = await this.tenantService.getTenantById(Number(id))
            if (!tenant) {
                return httpResponse(req, res, 404, 'Tenant not found')
            }
            httpResponse(req, res, 200, 'Tenant', tenant)
            this.logger.info('Get tenant by id', { id })
        } catch (error) {
            if (error instanceof Error) {
                {
                    httpError(next, error, req, 500)
                }
            }
            this.logger.error('Error in getTenantById method', error)
        }
    }
    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const deletedTenant = await this.tenantService.deleteById(Number(id))
            if (!deletedTenant) {
                return httpResponse(req, res, 404, 'Tenant not found')
            }
            httpResponse(req, res, 200, 'Tenant deleted', deletedTenant)
            this.logger.info('Tenant deleted', { id })
        } catch (error) {
            if (error instanceof Error) {
                {
                    httpError(next, error, req, 500)
                }
            }
            this.logger.error('Error in deleteById method', error)
        }
    }
}
