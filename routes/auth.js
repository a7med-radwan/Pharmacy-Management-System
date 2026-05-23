const {Router} = require('express');
const {authController} = require('../controllers');
const { auth, authLimiter } = require('../middlewares');

const router = Router();

// protect login and signup with rate limit
router.post('/signup', authLimiter, authController.signup)
    .post('/login', authLimiter, authController.login)
    .post('/logout', auth, authController.logout);

module.exports = router;