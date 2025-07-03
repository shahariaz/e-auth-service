import { checkSchema } from 'express-validator'
export default checkSchema(
    {
        currentPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value)
                    return Number.isNaN(parsedValue) ? 1 : parsedValue
                }
            }
        },
        perPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value)
                    return Number.isNaN(parsedValue) ? 10 : parsedValue
                }
            }
        }
    },
    ['query']
)
