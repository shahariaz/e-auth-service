import request from 'supertest'
import app from '../../src/app'

describe('POST /auth/register', () => {
    describe('Given all fields', () => {
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
            const response = await request(app).post('/auth/register').send(userData)
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
            const response = await request(app).post('/auth/register').send(userData)
            // Assert
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })
    })

    describe('Fields Are Missing', () => {
        // Add tests for missing fields here
    })
})
