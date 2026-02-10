const { Pharmacy } = require('../models');
const createError = require('http-errors');
const { ObjectId } = require('bson');

const add = (req, res, next) => {
    const pharmacyData = req.body;

    const validation = Pharmacy.validate(pharmacyData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const pharmacy = new Pharmacy(pharmacyData);
    pharmacy.isExist()
        .then(result => {
            if (result.check) {
                return next(createError(409, result.message));
            }

            drug.save((status) => {
                if (!status.status) {
                    return next(createError(500, status.message));
                }
                return returnJson(res, 201, true, "The pharmacy has been added.", status.data);
            });
        })
        .catch(err => {
            return next(createError(500, err.message));
        });

    pharmacy.save((status) => {
        if (!status.status) {
            return next(createError(500, status.message));
        }

        return returnJson(res, 201, true, "Pharmacy added successfully", status.data);
    });
};


const update = (req, res, next) => {
    const _id = req.params.id;

    if (!ObjectId.isValid(_id)) {
        return next(createError(400, "Invalid pharmacy ID"));
    }

    const pharmacyData = req.body;
    const pharmacy = new Pharmacy(pharmacyData);

    const validation = Pharmacy.validate(pharmacyData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    pharmacy.update(new ObjectId(_id), (status) => {
        if (!status.status) {
            return next(createError(500, status.message));
        }

        return returnJson(res, 200, true, "Pharmacy updated successfully", null);
    });
};

const getAll = (req, res, next) => {
    Pharmacy.getAll((result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "Pharmacies retrieved successfully", result.data);
    });
};
const getAllWithAlternativeDrugs = (req, res, next) => {
    Pharmacy.getAllWithAlternativeDrugs((result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "Pharmacies with alternative drugs", result.data);
    });
};

const remove = (req, res, next) => {
    const _id = req.params.id;

    if (!ObjectId.isValid(_id)) {
        return next(createError(400, "Invalid pharmacy ID"));
    }

    Pharmacy.remove(new ObjectId(_id), (result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "Pharmacy deleted successfully", null);
    });
};

module.exports = { add, update, getAll, remove ,getAllWithAlternativeDrugs};
