import app from './src/app'
import { calculateDiscount } from './utils'
import request from 'supertest'
describe('Discount', () => {
    it('should return correct discount', () => {
        const discount = calculateDiscount(100, 10)
        expect(discount).toBe(90)
    })
    it('should return 200 status code', async () => {
        const response = await request(app).get('/').send()
        expect(response.statusCode).toBe(200)
    })
})
