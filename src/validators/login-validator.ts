import { checkSchema } from 'express-validator'
export default checkSchema({
    email: {
        errorMessage: 'Please enter your email address',
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: 'Please enter a valid email address'
        }
    },
    password: {
        trim: true,
        errorMessage: 'Please enter your password',
        notEmpty: true,
        isLength: {
            errorMessage: 'Password must be at least 6 characters long',
            options: { min: 6 }
        }
    }
})
