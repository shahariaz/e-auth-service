import { Repository } from 'typeorm'
import { Tenant } from '../entity/Tenant'
import { Logger } from 'winston'
import { ITenant } from '../types/interface'

export class TenantService {
    constructor(
        private tenantRepo: Repository<Tenant>,
        private logger: Logger
    ) {
        this.tenantRepo = tenantRepo
        this.logger = logger
    }
    async create(tenantData: ITenant) {
        const tenant = await this.tenantRepo.save(tenantData)
        return tenant
    }
    async getAll() {
        const tenants = await this.tenantRepo.find()
        return tenants
    }
    async getTenantById(id: number) {
        try {
            const tenant = await this.tenantRepo.findOne({
                where: { id }
            })

            return tenant
        } catch (error) {
            this.logger.error('Error in getTenantById method', error)
        }
    }
    async deleteById(id: number) {
        try {
            const tenant = await this.tenantRepo.delete(id)
            return tenant
        } catch (error) {
            this.logger.error('Error in deleteById method', error)
            throw error
        }
    }
}
