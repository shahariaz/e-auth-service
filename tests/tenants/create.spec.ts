import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
describe('Post tenant/crete', () => {
    let connection: DataSource
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })
    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
    })
    afterAll(async () => {
        await connection.destroy()
    })
    describe('Given All Fields', () => {
        it('should return a 201 status code', async () => {
            // Arrange
            const tenantData = {
                name: 'Test Tenant',
                address: 'Test Address'
            }
            // Act
            const response = await request(app as any)
                .post('/tenant')
                .send(tenantData)

            // Assert
            expect(response.status).toBe(201)
        })
        it('should create a tenant in database', async () => {
            // Arrange
            const tenantData = {
                name: 'Test Tenant',
                address: 'Test Address'
            }
            // Act
            await request(app as any)
                .post('/tenant')
                .send(tenantData)
            // Assert
            const tenantRepo = connection.getRepository(Tenant)
            const tenant = await tenantRepo.find()
            expect(tenant).toHaveLength(1)
            expect(tenant[0].name).toEqual(tenantData.name)
            expect(tenant[0].address).toEqual(tenantData.address)
            expect(tenant[0].updatedAt).toBeTruthy()
            expect(tenant[0].createdAt).toBeTruthy()
        })
    })
})
