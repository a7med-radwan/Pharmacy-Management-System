const { Router } = require('express');
const { primaryDrugController } = require('../controllers');
const { auth } = require('../middlewares');

const router = new Router();

router.post('/add', auth, primaryDrugController.add)
    .get('/getAll', auth, primaryDrugController.getAll)
    .put('/update/:id', auth, primaryDrugController.update)
    .delete('/delete/:id', auth, primaryDrugController.remove)
    .get('/all_with_alternatives', auth, primaryDrugController.getAllWithAlternatives);

module.exports = router;
