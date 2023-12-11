const Expense = require('../models/expense-model'); 
const User = require('../models/user-model'); 
const sequelize = require('../utils/database');
const express = require('express');
const app = express();
const path = require('path');
const { Op } = require('sequelize');




exports.indexPage = (req, res) => {
  const pageUrl = 'C:/Users/ADMIN/Desktop/Vaishnavi/Sharpener/ExpressSQL/Expense Tracker/public/expense.html';
  res.sendFile(pageUrl);
};

exports.AddExpenseToDB = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { amount, description, type } = req.body;
        const userId = req.user.id; // Assuming req.user contains the user details

        const newExpense = await Expense.create({
            amount,
            description,
            type,
            userId // Associate the Expense with the User by providing the userId
        }, { transaction: t });

        // Calculate total based on expense type (Expense or Income)
        const user = await User.findByPk(userId, { transaction: t });

        if (type === 'Expense') {
            const totalExpense = Number(user.total) + Number(amount);
            await user.update({ total: totalExpense }, { transaction: t });
        } else if (type === 'Income') {
            const totalIncome = Number(user.incomeTotal) + Number(amount);
            await user.update({ incomeTotal: totalIncome }, { transaction: t });
        }

        await t.commit();
        return res.status(200).json({ expense: newExpense });
    } catch (err) {
        console.error("Unable to add expense to database", err);
        if (t) await t.rollback();
        res.status(500).json({ error: 'An error occurred while adding the expense' });
    }
}

exports.getTotals = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assuming req.user contains the user details

        // Calculate total expense of type 'Expense' for the user
        const totalExpense = await Expense.sum('amount', {
            where: {
                userId,
                type: 'Expense'
            }
        });

        // Calculate total income of type 'Income' for the user
        const totalIncome = await Expense.sum('amount', {
            where: {
                userId,
                type: 'Income'
            }
        });

        // Update the 'totalExpense' and 'totalIncome' columns in the User table
        const user = await User.findByPk(userId);
        if (user) {
            await user.update({ totalExpense, totalIncome });
        }

        return res.status(200).json({ totalExpense, totalIncome });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while calculating totals' });
    }
}

// // Route to find total expense and total income
//  exports.getTotals= async (req, res, next) => {
//     console.log("server");
//     try {

//         const totalExpense = await req.user.getExpenses();
//         console.error("ppppp",totalExpense);
    
//         return res.status(200).json({ totalExpense: totalExpense }); 
//       //  const totalExpense = await Expense.sum('amount', { where: { type: 'Expense' } });
 
//       //  const totalIncome = await Expense.sum('amount', { where: { type: 'Income' } });

       
//        // res.json({ totalExpense, totalIncome });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while calculating totals' });
//     }
// }



exports.getDailyExpense = async (req, res) => {
    console.log("server");
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const userId = req.user.id; 
        const dailyExpenses = await Expense.findAll({
            where: {
                userId, // Filter by user ID
                type: 'expense',
                createdAt: {
                    [Op.gte]: today,
                },
            },
        });

        res.json(dailyExpenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching daily expenses' });
    }
}

exports.getMonthlyExpense = async (req, res) => {

    try {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        const userId = req.user.id; 
        const monthlyExpenses = await Expense.findAll({
            where: {
                userId,
                type: 'expense',
                createdAt: {
                    [Op.gte]: thisMonth,
                },
            },
        });

        res.json(monthlyExpenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching monthly expenses' });
    }
}


exports.getYearlyExpense = async (req, res) => {
    try {
        const thisYear = new Date();
        thisYear.setMonth(0, 1);
        thisYear.setHours(0, 0, 0, 0);
        const userId = req.user.id; 
        const yearlyExpenses = await Expense.findAll({
            where: {
                userId,
                type: 'expense', // Filter by expense type
                createdAt: {
                    [Op.gte]: thisYear,
                },
            },
        });
       // console.log(".."+yearlyExpenses);

       
        res.status(200).json({ yearlyExpenses });
    } catch (error) {
        
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
    }
};


//Endpoint to get user details by ID
exports.getUserInfo = async (req, res) => {
  const userId = req.user.id;
  try {
    // Find the user by ID in the database and select only the 'name' field
    const user = await User.findByPk(userId, {
      attributes: ['userName'] // Specify the 'name' field to be retrieved
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // User found, send user's name in the response
    res.status(200).json({ userName: user.userName });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Error fetching user details' });
  }
};


exports.getUserLeaderboard = async (req, res) => {
  try {
    const leaderboardOfUsers = await User.findAll({
      order: [['total', 'DESC']], // Sorting by the 'total' field in descending order
    });

    res.status(200).json(leaderboardOfUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leaderboard', error: err });
  }
};


