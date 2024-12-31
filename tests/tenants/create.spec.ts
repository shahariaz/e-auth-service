import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constant/application'
describe('Post tenant/crete', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:8002')
        connection = await AppDataSource.initialize()
    })
    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()
    })
    afterEach(() => {
        jwks.stop()
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
            const accessToken = jwks.token({
                sub: '20',
                role: Roles.ADMIN
            })
            // Act
            const response = await request(app as any)
                .post('/tenant')
                .set('Cookie', [`accessToken=${accessToken}`])
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
            const accessToken = jwks.token({
                sub: '20',
                role: Roles.ADMIN
            })
            // Act
            const response = await request(app as any)
                .post('/tenant/create')
                .set('Cookie', [`accessToken=${accessToken}`])
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
        it('should return 401 if user is not authenticated', async () => {
            // Arrange
            const tenantData = {
                name: 'Test Tenant',
                address: 'Test Address'
            }
            const accessToken = jwks.token({
                sub: '20',
                role: Roles.ADMIN
            })
            // Act
            const response = await request(app as any)
                .post('/tenant/create')
                .set('Cookie', [`accessFToken=${accessToken}`])
                .send(tenantData)
            // Assert
            expect(response.status).toBe(401)
            const tenantRepo = connection.getRepository(Tenant)
            const tenant = await tenantRepo.find()
            expect(tenant).toHaveLength(0)
        })
    })
})
