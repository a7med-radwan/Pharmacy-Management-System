const jwt = require('jsonwebtoken');
const AppError = require('../my_modules/AppError');
const { readFileSync } = require('fs');
const { dbConnection } = require('../configurations');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next(new AppError('Authorization header is missing', 401));
    }

    const token = authHeader.split(' ')[1];
    const secretKey = readFileSync('./configurations/private.key');

    dbConnection('tokens', async (collection) => {
        try {
            const blacklisted = await collection.findOne({ token });
            if (blacklisted) {
                return next(new AppError('Token has been invalidated', 401));
            }

            const decode = jwt.verify(token, secretKey);
            req._user_id = decode._id;

            return next();
        } catch (err) {
            return next(new AppError('Invalid or expired token', 401));
        }
    });
};
