import createJWKSMock from 'mock-jwks'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'

describe('POST /users', () => {
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
    it('should persist the user in the database', async () => {})
    it('should return the 403 if non admin user tries to create a user')
})
