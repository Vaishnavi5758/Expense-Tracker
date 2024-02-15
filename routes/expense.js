const path = require('path');

const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');
const authentication = require('../middleware/auth');


router.get('/', expenseController.indexPage);

router.post('/AddExpenseToDB',authentication.authenticate, expenseController.AddExpenseToDB);

 router.get('/getTotals',authentication.authenticate, expenseController.getTotals);

 router.get('/getDailyExpense',authentication.authenticate, expenseController.getDailyExpense);

 router.get('/getMonthlyExpense',authentication.authenticate, expenseController.getMonthlyExpense);


 router.get('/getYearlyExpense',authentication.authenticate, expenseController.getYearlyExpense);

router.get('/getUserInfo',authentication.authenticate, expenseController.getUserInfo);

router.get('/showLeaderboard', authentication.authenticate, expenseController.getUserLeaderboard);

router.get('/expense/download', authentication.authenticate, expenseController.downloadExpense);




//router.delete('/deleteexpense/:id', userController.deleteexpense);


module.exports = router;
