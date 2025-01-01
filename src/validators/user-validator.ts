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
    firstName: {
        errorMessage: 'Please enter your first name',
        notEmpty: true,
        trim: true
    },
    lastName: {
        errorMessage: 'Please enter your last name',
        notEmpty: true,
        trim: true
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
