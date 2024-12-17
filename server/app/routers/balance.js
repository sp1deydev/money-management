const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');
const { checkLogin } = require('../middleware/auth');


router.get('/', checkLogin, balanceController.getBalance);

module.exports = router;

