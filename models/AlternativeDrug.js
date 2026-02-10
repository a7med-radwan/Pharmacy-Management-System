const { dbConnection } = require('../configurations');
const { alternativeDrugValidator } = require('../validators');
const { ObjectId } = require('bson');

class AlternativeDrug {
    constructor(dataDrug) {
        this.dataDrug = dataDrug;
    }

    save(cb) {
        dbConnection('alternative_drugs', async (collection) => {
            try {
                const result = await collection.insertOne(this.dataDrug);
                cb({ status: true, dataDrug: { _id: result.insertedId } });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    update(_id, cb) {
        dbConnection('alternative_drugs', async (collection) => {
            try {
                const result = await collection.updateOne(
                    { _id },
                    { $set: this.dataDrug }
                );
                // بحث عنها وكان شرحها انو دالة updateOne بترجع الmatchedCount لو كانت قيمتها تساوي 0 يعني ما لقت الدوا بالداتا بيز
                if (result.matchedCount === 0) {
                    return cb({ status: false, message: 'Alternative Drugs not found' });
                }
                cb({ status: true });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }
    static getAll(cb) {
        dbConnection('alternative_drugs', async (collection) => {
            try {
                const alternatives = await collection.find({}).toArray();
                cb({ status: true, dataDrug: alternatives });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static remove(_id, cb) {
        dbConnection('alternative_drugs', async (collection) => {
            try {
                await collection.deleteOne({ _id });
                cb({ status: true });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }
    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection('alternative_drugs', async (collection) => {
                try {
                    const existing = await collection.findOne({
                        $or: [
                            { name: this.dataDrug.name },
                            { scientific_name: this.dataDrug.scientific_name }
                        ]
                    });

                    if (existing) {
                        const message = (existing.name === this.dataDrug.name)
                            ? 'Drug name already exists'
                            : 'Scientific name already exists';
                        return resolve({ check: true, message });
                    }

                    resolve({ check: false });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static validate(data) {
        return alternativeDrugValidator.validate(data);
    }
}

module.exports = AlternativeDrug;
