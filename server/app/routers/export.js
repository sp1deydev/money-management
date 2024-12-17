const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { checkLogin } = require('../middleware/auth');


router.post('/', checkLogin, exportController.exportIncome);

module.exports = router;

