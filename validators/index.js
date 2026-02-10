const { schema, loginSchema } = require('./user')
const alternativeDrugValidator = require('./alternativeDrug');
const primaryDrugValidator = require('./primaryDrugr');
const pharmacyValidator = require('./pharmacy');



module.exports = {
    userValidator: schema,
    loginValidator: loginSchema,
    alternativeDrugValidator: alternativeDrugValidator,
    primaryDrugValidator: primaryDrugValidator,
    pharmacyValidator:pharmacyValidator
};
