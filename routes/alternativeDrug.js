const { Router } = require('express');
const { alternativeDrugController } = require('../controllers');
const { auth } = require('../middlewares');

const router = Router();

router.post('/add', auth, alternativeDrugController.add)
    .put('/update/:id', auth, alternativeDrugController.update)
    .get('/getAll', auth, alternativeDrugController.getAll)
    .delete('/delete/:id', auth, alternativeDrugController.remove);

module.exports = router;
