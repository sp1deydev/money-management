const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkLogin } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/', checkLogin, authController.getUser);
router.get('/logout', authController.logout);

module.exports = router;

