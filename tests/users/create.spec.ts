import createJWKSMock from 'mock-jwks'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constant/application'
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
    it('should persist the user in the database', async () => {
        ///AAA
        //Arrange
        const userData = {
            firstName: 'Shaharaz',
            lastName: 'Ahammed',
            email: 'shahariaz@gmail.com',
            password: '123456',
            tenantId: 1
        }
        const accessToken = jwks.token({
            sub: '4',
            role: 'admin'
        })
        //Act
        const response = await request(app)
            .post('/users')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(userData)
        //Assert
        const userRepository = connection.getRepository(User)
        const user = userRepository.find()
        expect(user).toHaveLength(1)
        expect(response.statusCode).toBe(201)
        expect(user[0].role).toBe(Roles.MANAGER)
        expect(user[0].email).toBe('shahariaz@gmail.com')
    })
    it('should return the 403 if non admin user tries to create a user')
})
