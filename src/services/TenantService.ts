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
        const tenantRepo = await this.tenantRepo.save(tenantData)
        return tenantRepo
    }
}
