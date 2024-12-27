import request from 'supertest'
import app from '../../src/app'
import { DataSource, DeepPartial } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { isJwt } from '../utils/index'
import { Roles } from '../../src/constant/application'
import { RefreshToken } from '../../src/entity/RefreshToken'

describe('POST /auth/register', () => {
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
    describe('Given all fields', () => {
        it('should clear the database between tests', async () => {
            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users).toHaveLength(0)
        })
        it('should return 201 status code', async () => {
            // AAA -- Arrange Act Assert

            // Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456',
                role: 'customer'
            }
            // Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            // Assert
            console.log('response', response.body)
            expect(response.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            // AAA -- Arrange Act Assert

            // Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456',
                role: 'customer'
            }
            // Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            // Assert
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })
        it('should persist the usier in the database', async () => {
            //AAA --Arrange Act Assert
            //Arrange
            // Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456',
                role: 'customer'
            }
            // Act
            await request(app as any)
                .post('/auth/register')
                .send(userData)
            // Assert
            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users).toHaveLength(1)
            expect(users[0].email).toEqual('shahara@gmail.com')
        })
        it('should return the user in the response', async () => {
            //AAA--Arrange Act Assert
            //Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahriaz@gmail.com',
                password: '123456',
                role: 'customer'
            }
            //Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            //Assert
            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users).toHaveLength(1)
            expect(users[0].email).toEqual('shahriaz@gmail.com')
        })
        it('should return an id of the created user', async () => {
            //AAA--Arrange Act Assert
            //Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456',
                role: 'customer'
            }
            //act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            //Assert

            expect(response.body.data).toHaveProperty('id')
            const repository = connection.getRepository(User)
            const users = await repository.find()
            expect((response.body.data as Record<string, string>).id).toBe(users[0].id)
        })
        it('should return user role', async () => {
            //AAA-- Arrange Act Assert
            //Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahariaz@gmail.com',
                password: '123456',
                role: 'customer'
            }
            //Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            //Assert
            expect(response.body.data).toHaveProperty('role')
            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users[0]).toHaveProperty('role')
            expect(users[0].role).toBe('customer')
        })
        it('should store the hashed password in the database', async () => {
            //AAA--Arrange Act Assert
            //Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahariaz@gmail.com',
                password: '123456',
                role: 'customer'
            }
            //Act
            await request(app as any)
                .post('/auth/register')
                .send(userData)
            //Assert
            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users[0].password).not.toBe('123456')
            expect(users[0].password).toHaveLength(60)
        })
        it('should return 400 status code if the email is already exists', async () => {
            //AAA--Arrange Act Assert
            //Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456',
                role: Roles.CUSTOMER
            }

            const userRepo = connection.getRepository(User)
            await userRepo.save(userData as DeepPartial<User>)

            //Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            //Assert
            const users = await userRepo.find()
            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(1)
        })
        it('should return the access token and refresh token inside a cookie', async () => {
            //AAA--Arrange Act Assert
            //Arrange
            let accessToken: string | null = null
            let refreshToken: string | null = null
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456',
                role: 'customer'
            }
            //Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)

            interface Headers {
                ['set-cookie']: string[]
            }
            //Assert
            const users = await connection.getRepository(User).find()
            const cookies = (response.headers as unknown as Headers)['set-cookie'] || []

            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1]
                }
                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1]
                }
            })

            expect(accessToken).not.toBeNull()

            expect(refreshToken).not.toBeNull()
            expect(isJwt(accessToken)).toBeTruthy()
            expect(isJwt(refreshToken)).toBeTruthy()
        })
        it('should store the refresh token in the database', async () => {
            //AAA-- Arrange Act Assert
            //Arrange

            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456',
                role: 'customer'
            }
            //Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            //Assert
            const refreshTokenRepo = connection.getRepository(RefreshToken)
            // const refreshToken = await refreshTokenRepo.find()

            const token = await refreshTokenRepo
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', { userId: (response.body.data as Record<string, string>).id })
                .getMany()
            expect(token).toHaveLength(1)
        })
    })

    describe('Fields Are Missing', () => {
        // Add tests for missing fields here
        it('should  return 400 status code if email field is missing', async () => {
            //AAA--Arrange Act Assert
            //Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                password: '123456',
                role: 'customer'
            }
            //Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            //Assert
            expect(response.statusCode).toBe(400)
            const users = await connection.getRepository(User).find()
            expect(users).toHaveLength(0)
        })
    })
    describe('Filed Are not in proper format', () => {
        it('should trim the email field', async () => {
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: '  shahara@gmail.com  ',
                password: '123456',
                role: 'customer'
            }
            // Act
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)
            // Assert
            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()

            expect(users[0].email).toBe('shahara@gmail.com')
        })
    })
})
