import request from 'supertest'
import app from '../../src/app'
import { DataSource } from 'typeorm'

import { AppDataSource } from '../../src/config/data-source'
import { truncateTables } from '../utils'
import { User } from '../../src/entity/User'

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
                password: '123456'
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
                password: '123456'
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
                password: '123456'
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
    })

    describe('Fields Are Missing', () => {
        // Add tests for missing fields here
    })
})
