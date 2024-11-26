import request from 'supertest'
import app from '../../src/app'
describe('POST /auth/register', () => {
    describe('Given all fileds', () => {
        it('should return 201 status code', async () => {
            // AAA -- Arrange Act Assert

            // Arrange
            const userData = {
                firstName: 'Shaharaiz',
                lastName: 'Ahammed',
                email: 'shahara@gmail.com',
                password: '123456'
            }
            //Act
            const respone = await request(app).post('/auth/register').send(userData)
            //Assert
            expect(respone.statusCode).toBe(201)
        })
    })
    describe('Fileds Are Missing', () => {})
})
