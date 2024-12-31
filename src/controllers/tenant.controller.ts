import { Request, Response, NextFunction } from 'express'
import { Logger } from 'winston'
import { TenantService } from '../services/TenantService'
import { ITenant } from '../types/interface'
import httpResponse from '../util/httpResponse'
import httpError from '../util/httpError'
export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger
    ) {}
    async createTenant(req: Request, res: Response, next: NextFunction) {
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
}
