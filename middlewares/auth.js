const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { readFileSync } = require('fs');
const { dbConnection } = require('../configurations');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next(createError(401, 'Authorization header is missing'));
    }

    const token = authHeader.split(' ')[1];
    const secretKey = readFileSync('./configurations/private.key');

    dbConnection('tokens', async (collection) => {
        try {
            const blacklisted = await collection.findOne({ token });
            if (blacklisted) {
                return next(createError(401, 'Token has been invalidated'));
            }

            const decode = jwt.verify(token, secretKey);
            req._user_id = decode._id;

            return next();
        } catch (err) {
            return next(createError(401, 'Invalid or expired token'));
        }
    });
};
