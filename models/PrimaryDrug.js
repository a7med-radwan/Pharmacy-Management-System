const { dbConnection } = require('../configurations');
const { primaryDrugValidator } = require('../validators');

class PrimaryDrug {
    constructor(drugData) {
        this.drugData = drugData;
    }

    save(cb) {
        dbConnection('primary_drugs', async (collection) => {
            try {
                const result = await collection.insertOne(this.drugData);
                cb({ status: true, data: { _id: result.insertedId } });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static getAll(cb) {
        dbConnection('primary_drugs', async (collection) => {
            try {
                const drugs = await collection.find({}).toArray();
                cb({ status: true, data: drugs });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }
    static getAllWithAlternatives(cb) {
        dbConnection('primary_drugs', async (collection) => {
            try {
                const result = await collection.aggregate([
                    {
                        $lookup: {
                            from: 'alternative_drugs',
                            localField: '_id',
                            foreignField: 'parent_primary_id',
                            as: 'alternatives'
                        }
                    },
                    {
                        // هان بحثت عليها  وشرحها انها بتقيد العرض يكون للادوية الاساسية الذي لها بدائل
                        $match: {
                            "alternatives.0": { $exists: true }
                        }
                    }
                ]).toArray();

                cb({ status: true, data: result });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }


    update(_id, cb) {
        if (!this.drugData) {
            return cb({ status: false, message: "Drug data is missing." });
        }

        dbConnection('primary_drugs', async (collection) => {
            try {
                const result = await collection.updateOne(
                    { _id },
                    { $set: this.drugData }
                );
                // بحث عنها وكان شرحها انو دالة updateOne بترجع الmatchedCount لو كانت قيمتها تساوي 0 يعني ما لقت الدوا بالداتا بيز
                if (result.matchedCount === 0) {
                    return cb({ status: false, message: 'Primary Drugs not found' });
                }
                cb({ status: true });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }


    static remove(_id, cb) {
        dbConnection('primary_drugs', async (collection) => {
            try {
                const result = await collection.deleteOne({ _id });
                cb({status: true})
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static getById(_id, cb) {
        dbConnection('primary_drugs', async (collection) => {
            try {
                const drug = await collection.findOne({ _id });
                if (!drug) return cb({ status: false });
                cb({ status: true, data: drug });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }


    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection('primary_drugs', async (collection) => {
                try {
                    const existing = await collection.findOne({
                        $or: [
                            { name: this.drugData.name },
                            { scientific_name: this.drugData.scientific_name }
                        ]
                    });

                    if (existing) {
                        const message = (existing.name === this.drugData.name)
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

    static validate(drugData) {
        return primaryDrugValidator.validate(drugData);
    }
}

module.exports = PrimaryDrug;
