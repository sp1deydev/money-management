const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { checkLogin } = require('../middleware/auth');


router.get('/', checkLogin, incomeController.getAllIncomes);
router.get('/get-by-type', checkLogin, incomeController.getIncomeByType);
router.get('/get-by-week', checkLogin, incomeController.getIncomeByWeek);
router.get('/get-by-date', checkLogin, incomeController.getIncomeByDate);
router.post('/create', checkLogin, incomeController.createIncome);
router.put('/update', checkLogin, incomeController.updateIncome);
router.delete('/delete', checkLogin, incomeController.deleteIncome);

module.exports = router;

