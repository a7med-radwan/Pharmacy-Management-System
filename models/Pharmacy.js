const { dbConnection } = require('../configurations');
const { pharmacyValidator } = require('../validators');
class Pharmacy {
    constructor(pharmacyData) {
        this.pharmacyData = pharmacyData;
    }

    save(cb) {
        dbConnection('pharmacies', async (collection) => {
            try {
                const result = await collection.insertOne(this.pharmacyData);
                cb({ status: true, data: { _id: result.insertedId } });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    update(_id, cb) {
        dbConnection('pharmacies', async (collection) => {
            try {
                const result = await collection.updateOne(
                    { _id },
                    { $set: this.pharmacyData }
                );
                // بحث عنها وكان شرحها انو دالة updateOne بترجع الmatchedCount لو كانت قيمتها تساوي 0 يعني ما لقت الصيدلية بالداتا بيز
                if (result.matchedCount === 0) {
                    return cb({ status: false, message: 'Pharmacy not found' });
                }
                cb({ status: true });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static getAll(cb) {
        dbConnection('pharmacies', async (collection) => {
            try {
                const pharmacies = await collection.find({}).toArray();
                cb({ status: true, data: pharmacies });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static getAllWithAlternativeDrugs(cb) {
        dbConnection('pharmacies', async (collection) => {
            try {
                const result = await collection.aggregate([
                    {
                        $lookup: {
                            from: 'alternative_drugs',
                            localField: '_id',
                            foreignField: 'parent_pharmacy_id',
                            as: 'alternativeDrugs'
                        }
                    },
                    {
                        // هان بحثت عليها  وشرحها انها بتقيد العرض يكون للادوية الفرعية الموجودة بالصيدلية
                        $match: {
                            "alternativeDrugs.0": { $exists: true }
                        }
                    }
                ]).toArray();

                cb({ status: true, data: result });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static remove(_id, cb) {
        dbConnection('pharmacies', async (collection) => {
            try {
                await collection.deleteOne({ _id });
                cb({ status: true });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }
    static  getById(_id, cb) {
        dbConnection('pharmacies', async (collection) => {
            try {
                const pharmacy = await collection.findOne({ _id });
                if (!pharmacy) return cb({ status: false });
                cb({ status: true, data: pharmacy });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection('pharmacies', async (collection) => {
                try {
                    const existing = await collection.findOne({
                        $or: [
                            { name: this.pharmacyData.name },
                            { email: this.pharmacyData.email }
                        ]
                    });

                    if (existing) {
                        const message = (existing.name === this.pharmacyData.name)
                            ? 'Pharmacy name already exists'
                            : 'Email already exists';
                        return resolve({ check: true, message });
                    }

                    resolve({ check: false });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static validate(pharmacyData) {
        return pharmacyValidator.validate(pharmacyData);
    }
}

module.exports = Pharmacy;
