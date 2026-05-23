const { Router } = require('express');
const { primaryDrugController } = require('../controllers');
const { auth } = require('../middlewares');
const cache = require('../my_modules/cache');

const router = new Router();

// Cache the response of these GET endpoints for 10 seconds
router.post('/add', auth, primaryDrugController.add)
    .get('/getAll', auth, cache(10), primaryDrugController.getAll)
    .put('/update/:id', auth, primaryDrugController.update)
    .delete('/delete/:id', auth, primaryDrugController.remove)
    .get('/all_with_alternatives', auth, cache(10), primaryDrugController.getAllWithAlternatives);

module.exports = router;
