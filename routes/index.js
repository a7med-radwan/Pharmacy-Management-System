const primaryDrugRouter = require('./primaryDrug');
const authRouter = require('./auth');
const alternativeDrugRouter = require('./alternativeDrug');
const pharmacyRoutes = require('./pharmacy');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.status(200).json({
            status: true,
            message: 'Drug API running'
        });
    });

    app.use('/pharmacies', pharmacyRoutes);
    app.use('/primaryDrugs', primaryDrugRouter);
    app.use('/auth', authRouter);
    app.use('/alternativeDrugs', alternativeDrugRouter);
};
