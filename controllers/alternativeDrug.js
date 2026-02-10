const { dbConnection } = require('../configurations');
const { AlternativeDrug , PrimaryDrug, Pharmacy} = require('../models');
const createError = require('http-errors');
const { ObjectId } = require('bson');

const add = (req, res, next) => {
    const altDrugdata = req.body;

    const validation = AlternativeDrug.validate(altDrugdata);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const primaryId = new ObjectId(altDrugdata.parent_primary_id);
    const pharmacyId = new ObjectId(altDrugdata.parent_pharmacy_id);

    PrimaryDrug.getById(primaryId, (primaryStatus) => {
        if (!primaryStatus.status) {
            return next(createError(404, "The primary drug does not exist"));
        }

        Pharmacy.getById(pharmacyId, (pharmacyStatus) => {
            if (!pharmacyStatus.status) {
                return next(createError(404, "pharmacy does not exist"));
            }

            const altDrug = new AlternativeDrug(altDrugdata);
            altDrug.isExist()
                .then(result => {
                    if (result.check) {
                        return next(createError(409, result.message));
                    }

                    altDrug.save((status) => {
                        if (!status.status) {
                            return next(createError(500, status.message));
                        }

                        return returnJson(res, 201, true, "Alternative drug added successfully", status.data);
                    });
                })
                .catch(err => {
                    return next(createError(500, err.message));
                });
        });
    });
};


const update = (req, res, next) => {
    const _id = req.params.id;

    if (!ObjectId.isValid(_id)) {
        return next(createError(400, "Invalid alternative drug ID"));
    }

    const data = req.body;
    const validation = AlternativeDrug.validate(data);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const altDrug = new AlternativeDrug(data);

    altDrug.update(new ObjectId(_id), (status) => {
        if (!status.status) {
            return next(createError(500, status.message));
        }

        return returnJson(res, 200, true, "Alternative drug updated successfully", null);
    });
};

const getAll = (req, res, next) => {
    AlternativeDrug.getAll((result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "Alternative drugs retrieved", result.data);
    });
};

const remove = (req, res, next) => {
    const _id = req.params.id;

    if (!ObjectId.isValid(_id)) {
        return next(createError(400, "Invalid ID"));
    }

    AlternativeDrug.remove(new ObjectId(_id), (result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "Alternative drug deleted", null);
    });
};

module.exports = { add, update, getAll, remove };
