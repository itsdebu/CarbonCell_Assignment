const Joi = require('joi')

const signupValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
})

const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).optional(),
});

module.exports = { signupValidator, loginValidator }

// User Api Validation..