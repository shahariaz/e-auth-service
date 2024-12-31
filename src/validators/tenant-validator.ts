import { checkSchema } from 'express-validator'

export default checkSchema({
    name: {
        errorMessage: 'Please enter your tenant name',
        notEmpty: true,
        trim: true
    },
    address: {
        errorMessage: 'Please enter your tenant address',
        notEmpty: true,
        trim: true
    }
})
