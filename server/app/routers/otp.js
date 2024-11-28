const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const { checkLogin } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');


router.post('/generate', otpController.generateEmailOTP);
router.post('/verify', otpController.verifyEmailOTP);

module.exports = router;



