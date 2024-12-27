import request from 'supertest'
import app from '../../src/app'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import bcrypt from 'bcrypt'
import { User } from '../../src/entity/User'
import { isJwt } from '../utils'
import { Roles } from '../../src/constant/application'
import { UserRole } from '../../src/types/interface'
describe('Post auth/login', () => {
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
    describe('When the user sends a valid email and password', () => {
        it('Should return status 200 and  token', async () => {
            //AAA -Arrange Act Assert
            //Arrange
            const userData = {
                firstName: 'Shaharaz',
                lastName: 'Ahammed',
                email: 'shaharaz@gmail.com',
                password: '123456'
            }
            const hashedPassword = await bcrypt.hash(userData.password, 10)
            const userRepo = connection.getRepository(User)
            const user = await userRepo.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER as UserRole
            })
            console.log(user)

            //Act
            const response = await request(app as any)
                .post('/auth/login')
                .send({ email: userData.email, password: userData.password })
            //Assert
            interface Headers {
                ['set-cookie']: string[]
            }
            let accessToken: string | null = null
            let refreshToken: string | null = null
            const cookies = (response.headers as unknown as Headers)['set-cookie'] || []
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1]
                }
                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1]
                }
            })
            expect(response.status).toBe(200)
            expect(response.body.data.email).toEqual(userData.email)
            expect(accessToken).not.toBeNull()
            expect(refreshToken).not.toBeNull()
            expect(isJwt(accessToken)).toBeTruthy()
            expect(isJwt(refreshToken)).toBeTruthy()
        })
    })
})
