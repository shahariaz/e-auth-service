import { checkSchema } from 'express-validator'
export default checkSchema({
    email: {
        errorMessage: 'Please enter your email address',
        notEmpty: true,
        trim: true
    }
})
