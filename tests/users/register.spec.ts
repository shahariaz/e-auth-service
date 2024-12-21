import request from 'supertest'
import app from '../../src/app'
import { DataSource, DeepPartial } from 'typeorm'

import { AppDataSource } from '../../src/config/data-source'

import { User } from '../../src/entity/User'
import { truncateTables } from '../utils/index'
import { Roles } from '../../src/constant/application'

describe('POST /auth/register', () => {
    let connection: DataSource
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })
    beforeEach(async () => {
        await truncateTables(connection)
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
        })
    })
})
