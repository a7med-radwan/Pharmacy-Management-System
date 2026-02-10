const { Router } = require('express');
const { pharmacyController } = require('../controllers');
const { auth } = require('../middlewares');

const router = new Router();

router.post('/add', auth, pharmacyController.add)
    .get('/getAll', auth, pharmacyController.getAll)
    .get('/all_with_alternative_drugs', auth, pharmacyController.getAllWithAlternativeDrugs)
    .put('/update/:id', auth, pharmacyController.update)
    .delete('/delete/:id', auth, pharmacyController.remove)

module.exports = router;
