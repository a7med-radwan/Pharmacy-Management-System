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

const update = (req, res, next) => {
    let _id = req.params.id;
    let newDrug = req.body;

    PrimaryDrug.getById(_id, (result) => {
        if (!result.status) {
            return next(createError(404, "The Drug Is Not Found"));
        }

        // check if user owns this drug
        const drugToUpdate = result.data;
        if (drugToUpdate.addedBy && drugToUpdate.addedBy.toString() !== req._user_id) {
            return next(createError(403, "Not allowed to edit this drug."));
        }

        PrimaryDrug.update(_id, newDrug, (updateResult) => {
            if (!updateResult.status) {
                return next(createError(500, updateResult.message));
            }
            return returnJson(res, 200, true, "The Update is Done", updateResult.data);
        });
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

        // check if user owns this drug
        const drugToDelete = result.data;
        if (drugToDelete.addedBy && drugToDelete.addedBy.toString() !== req._user_id) {
            return next(createError(403, "Not allowed to delete this drug."));
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
