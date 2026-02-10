const joi = require('@hapi/joi');

const schema = joi.object({
    name: joi.string().required(),
    scientific_name: joi.string().required(),
    description: joi.string().optional(),
    parent_primary_id: joi.string().required(),
    parent_pharmacy_id: joi.string().required()
});

module.exports =  schema ;
