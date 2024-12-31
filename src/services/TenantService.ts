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
        try {
            const tenant = await this.tenantRepo.save(tenantData)
            return tenant
        } catch (error) {
            this.logger.error('Error in create method', error)
            throw error
        }
    }
    async getAll() {
        try {
            const tenants = await this.tenantRepo.find()
            return tenants
        } catch (error) {
            this.logger.error('Error while getting all tenants', error)
            throw error
        }
    }
    async getTenantById(id: number) {
        try {
            const tenant = await this.tenantRepo.findOne({
                where: { id }
            })

            return tenant
        } catch (error) {
            this.logger.error('Error in getTenantById method', error)
            throw error
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
    async updateById(id: number, tenantData: ITenant) {
        try {
            const isExist = await this.tenantRepo.findOne({
                where: { id }
            })
            if (!isExist) {
                return null
            }

            const tenant = await this.tenantRepo.update(id, tenantData)
            return tenant
        } catch (error) {
            this.logger.error('Error in updateById method', error)
            throw error
        }
    }
}
