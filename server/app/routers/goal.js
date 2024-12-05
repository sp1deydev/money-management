const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { checkLogin } = require('../middleware/auth');


router.get('/', checkLogin, goalController.getAllGoals);
router.post('/create', checkLogin, goalController.createGoal);
router.put('/update', checkLogin, goalController.updateGoal);
router.delete('/delete', checkLogin, goalController.deleteGoal);

module.exports = router;

