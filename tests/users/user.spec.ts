import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
describe('GET /auth/self', () => {
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
    describe('Given All Fields', () => {
        it('should return the 200 status code', async () => {
            //AAA - Arrange Act Assert
            //Arrange
            //Act
            const respone = await request(app as any)
                .get('/auth/login')
                .send()
            //Assert
            expect(respone.status).toBe(200)
        })
    })
})
