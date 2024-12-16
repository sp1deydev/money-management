const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { checkLogin } = require('../middleware/auth');


router.get('/', checkLogin, expenseController.getAllExpenses);
router.get('/get-by-type', checkLogin, expenseController.getExpenseByType);
router.get('/get-by-week', checkLogin, expenseController.getExpenseByWeek);
router.get('/get-by-date', checkLogin, expenseController.getExpenseByDate);
router.post('/create', checkLogin, expenseController.createExpense);
router.put('/update', checkLogin, expenseController.updateExpense);
router.delete('/delete', checkLogin, expenseController.deleteExpense);

module.exports = router;

