const { dbConnection } = require('../configurations');
const { userValidator, loginValidator } = require('../validators');
const { hashSync, compareSync } = require('bcryptjs');

class User {
    constructor(userData) {
        this.userData = userData;
    }

    save(cb) {
        dbConnection('users', async (collection) => {
            try {
                this.userData.password = hashSync(this.userData.password);
                const result = await collection.insertOne(this.userData);
                cb({ status: true, _user_id: result.insertedId });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static login(loginData) {
        return new Promise((resolve, reject) => {
            const validation = loginValidator.validate(loginData);
            if (validation.error) {
                return resolve({
                    status: false,
                    message: validation.error.message,
                    code: 400
                });
            }

            dbConnection('users', async (collection) => {
                try {
                    const dbResult = await collection.aggregate([
                        {
                            $lookup: {
                                from: 'pharmacies',
                                localField: '_id',
                                foreignField: '_user_id',
                                as: 'pharmacy'
                            }
                        },
                        { $match: { username: loginData.username } },
                        { $limit: 1 }
                    ]).toArray();

                    if (!dbResult || dbResult.length === 0) {
                        return resolve({ status: false, message: 'User not found' });
                    }

                    const user = dbResult[0];

                    if (!compareSync(loginData.password, user.password)) {
                        return resolve({ status: false, message: 'Invalid password' });
                    }

                    user.pharmacy = user.pharmacy?.[0] || null;

                    resolve({ status: true, data: user });

                } catch (err) {
                    reject({ status: false, message: err.message });
                }
            });
        });
    }

    static validate(userData) {
        return userValidator.validate(userData);
    }

    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection('users', async (collection) => {
                try {
                    const user = await collection.findOne({
                        $or: [
                            { email: this.userData.email },
                            { username: this.userData.username }
                        ]
                    });

                    if (user) {
                        const message = (user.email === this.userData.email)
                            ? 'Email already in exists'
                            : 'Username already in exists';
                        return resolve({ check: true, message });
                    }

                    resolve({ check: false });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
}

module.exports = User;
