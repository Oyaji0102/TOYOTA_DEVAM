const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/quick-login', authController.quickLogin);
router.post('/logout', authController.logout);

module.exports = router;