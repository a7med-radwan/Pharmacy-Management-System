const joi = require('@hapi/joi');

const schema = joi.object({
    name: joi.string().required(),
    location: joi.string().required(),
    phone: joi.string().pattern(/^\+?\d{7,15}$/).required(),
    email: joi.string().email().required()
});

module.exports = schema;
