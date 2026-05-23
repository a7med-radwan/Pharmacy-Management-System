const primaryDrugRouter = require('./primaryDrug');
const authRouter = require('./auth');
const alternativeDrugRouter = require('./alternativeDrug');
const pharmacyRoutes = require('./pharmacy');

module.exports = (app) => {
    // API Root
    app.get('/', (req, res) => {
        res.status(200).json({
            status: true,
            message: 'Pharmacy Management API running'
        });
    });

    // Mount Modular Routers under API v1 prefix
    app.use('/api/v1/pharmacies', pharmacyRoutes);
    app.use('/api/v1/primaryDrugs', primaryDrugRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/alternativeDrugs', alternativeDrugRouter);
};
