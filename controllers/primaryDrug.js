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
    dbConnection('primary_drugs', async (collection) => {
        try {
            const drugs = await collection.find({}).toArray();
            return returnJson(res, 200, true, "Drugs display is Done", drugs);
        } catch (err) {
            next(createError(500, err.message));
        }
    });
};

const getAllWithAlternatives = (req, res, next) => {
    PrimaryDrug.getAllWithAlternatives((result) => {
        if (!result.status) {
            return next(createError(500, result.message));
        }

        return returnJson(res, 200, true, "Primary drugs with alternatives retrieved", result.data);
    });
};



const update = (req, res, next) => {
    const _id = req.params.id;

    if (!ObjectId.isValid(_id)) {
        return next(createError(400, "Id is nor valid"));
    }

    const drugData = req.body;
    const drug = new PrimaryDrug(drugData);

    const validation = PrimaryDrug.validate(drugData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

     drug.update(new ObjectId(_id), (status) => {
                if (!status.status) {
                    return next(createError(500, status.message));
                }

                return returnJson(res, 200, true, "The Update is Done", null);
            });
};



const remove = (req, res, next) => {
    const _id = new ObjectId(req.params.id);

    PrimaryDrug.getOne(_id)
        .then(result => {
            if (!result.status) {
                return next(createError(404, "The Drug Is Not Found"));
            }

            PrimaryDrug.remove(_id, (result) => {
                if (!result.status) {
                    return next(createError(500, result.message));
                }

                return returnJson(res, 200, true, "The Delete is Done", null);
            });
        })
        .catch(err => {
            return next(createError(500, err.message));
        });
};

module.exports = { add, remove, update, getAll , getAllWithAlternatives};
