import { DataSource } from 'typeorm'
import request from 'supertest'
import createJWKSMock from 'mock-jwks'

import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constant/application'
import { UserRole } from '../../src/types/interface'
describe('GET /auth/self', () => {
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

    describe('Given all fields', () => {
        it('should return the 200 status code', async () => {
            const accessToken = jwks.token({
                sub: '4',
                role: Roles.CUSTOMER
            })
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()
            expect(response.statusCode).toBe(404)
        })

        it('should return the user data', async () => {
            // Register user
            const userData = {
                firstName: 'Shahariaz',
                lastName: 'Ahammed',
                email: 'ShahariazAhammed@mern.space',
                password: 'password'
            }
            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER as UserRole
            })

            // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role
            })

            // Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send()

            // Assert
            // Check if user id matches with registered user
            expect((response.body.data as Record<string, string>).id).toBe(data.id)
        })
        it('should return the user data without password', async () => {
            const userData = {
                firstName: 'Shahariaz',
                lastName: 'Ahammed',
                email: 'ShahariazAhammed@mern.space',
                password: 'password'
            }
            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER as UserRole
            }) // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role
            })

            // Add token to cookie
            const response = await request(app as any)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send()
            //Assert
            expect(response.body.data).not.toHaveProperty('password')
        })
    })
})
