const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { checkLogin } = require('../middleware/auth');


router.post('/income', checkLogin, exportController.exportIncome);
router.post('/expense', checkLogin, exportController.exportExpense);

module.exports = router;

