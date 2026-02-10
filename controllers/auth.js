const { User } = require('../models');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { dbConnection } = require('../configurations');

const signup = (req, res, next) => {
    const userData = req.body;

    const validation = User.validate(userData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const user = new User(userData);
    user.isExist()
        .then(result => {
            if (result.check) {
                return next(createError(409, result.message));
            }

            user.save((status) => {
                if (status.status) {
                    return returnJson(res, 201, true, "User created", { _user_id: status._user_id });
                } else {
                    return next(createError(500, status.message));
                }
            });
        })
        .catch(err => {
            return next(createError(500, err.message));
        });
};


const login = (req, res, next) => {
    User.login(req.body)
        .then(result => {
            if (result.status) {

                const jwtSecretKey = readFileSync('./configurations/private.key');
                const token = jwt.sign(
                    {
                        _id: result.data._id,
                        username: result.data.username
                    },
                    jwtSecretKey
                );

                return returnJson(res, 200, true, "Logged in successfully ", { token });
            }

            next(createError(401, "Incorrect username or password"));
        })
        .catch(err => {
            next(createError(500, err.message));
        });
};
const logout = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return returnJson(res, 400, false, "Token not provided");
    }

    dbConnection('tokens', async (collection) => {
        try {
            await collection.insertOne({ token });
            return returnJson(res, 200, true, "Logged out successfully");
        } catch (err) {
            return next(createError(500, err.message));
        }
    });
};


module.exports = { signup, login,logout };
