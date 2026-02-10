const {Router} = require('express');
const {authController} = require('../controllers');
const { auth } = require('../middlewares');

const router = Router();

router.post('/signup',authController.signup)
    .post('/login', authController.login)
    .post('/logout', auth, authController.logout);

module.exports = router;