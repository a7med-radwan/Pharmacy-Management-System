const { dbConnection } = require('../configurations');
const { PrimaryDrug } = require('../models');
const createError = require('http-errors');
const { ObjectId } = require('bson');

const add = (req, res, next) => {
    const drugData = req.body;

    const validation = PrimaryDrug.validate(drugData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const drug = new PrimaryDrug(drugData);
    drug.isExist()
        .then(result => {
            if (result.check) {
                return next(createError(409, result.message));
            }

            drug.save((status) => {
                if (!status.status) {
                    return next(createError(500, status.message));
                }
                return returnJson(res, 201, true, "The drug has been added.", status.data);
            });
        })
        .catch(err => {
            return next(createError(500, err.message));
        });

};

const getAll = (req, res, next) => {
    PrimaryDrug.getAll((result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "", result.data);
    });
};

const getAllWithAlternatives = (req, res, next) => {
    PrimaryDrug.getAllWithAlternatives((result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "", result.data);
    });
};

const remove = (req, res, next) => {
    let _id = req.params.id;

    PrimaryDrug.getById(_id, (result) => {
        if (!result.status) {
            return next(createError(404, "The Drug Is Not Found"));
        }

        // We can add Resource-Based Auth here too
        const drugToDelete = result.data;
        if (drugToDelete.addedBy && drugToDelete.addedBy.toString() !== req._user_id) {
            return next(createError(403, "Resource Authorization Failed: Cannot delete others' records."));
        }

        PrimaryDrug.remove(_id, (removeResult) => {
            if (!removeResult.status) {
                return next(createError(500, removeResult.message));
            }

            return returnJson(res, 200, true, "The Delete is Done", null);
        });
    });
};

module.exports = { add, remove, update, getAll, getAllWithAlternatives };
