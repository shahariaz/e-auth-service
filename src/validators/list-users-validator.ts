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
        },
        q: {
            trim: true,
            customSanitizer: {
                options: (value: unknown) => {
                    return value ? value : ''
                }
            }
        },
        role: {
            isIn: {
                options: [['manager', 'admin', 'user']],
                errorMessage: 'Role must be one of the following: manager, admin, user'
            },
            optional: true
        }
    },
    ['query']
)
