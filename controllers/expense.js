const Expense = require('../models/expense-model'); 
const User = require('../models/user-model'); 
const sequelize = require('../utils/database');
const express = require('express');
const app = express();
const path = require('path');
const { Op } = require('sequelize');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const PDFDocument = require('pdfkit');





exports.indexPage = (req, res) => {
  const pageUrl = 'C:/Users/ADMIN/Desktop/Vaishnavi/Sharpener/ExpressSQL/Expense Tracker/public/expense.html';
  res.sendFile(pageUrl);
};

exports.AddExpenseToDB = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { amount, description, type } = req.body;
        const userId = req.user.id; //  req.user contains the user details

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const offset = (page - 1) * limit;

        const { count, rows } = await Expense.findAndCountAll({
            where: {
                userId, // Filter by user ID
                type: 'expense',
                createdAt: {
                    [Op.gte]: today,
                },
            },
            limit: limit,
            offset: offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            expenses: rows,
            pagination: {
                totalExpenses: count,
                totalPages: totalPages,
                currentPage: page
            }
        });
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
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 1; // Default limit
        const offset = (page - 1) * limit;

        // If the frontend sends a limit value greater than 1, use it
        if (limit > 1) {
            // Adjust the limit based on the screen size
            const screenWidth = req.headers['screen-width'];
            if (screenWidth >= 1200) {
                limit = 10; // Large screens
            } else if (screenWidth >= 700) {
                limit = 7; // Medium screens
            } else {
                limit = 5; // Small screens
            }
        }
        const screenWidth = req.headers['screen-width'];
        console.log('Screen Width:', screenWidth);
        console.log('Original Limit:', limit);

        const { count, rows } = await Expense.findAndCountAll({
            where: {
                userId,
                type: 'expense',
                createdAt: {
                    [Op.gte]: thisMonth,//Op.gte is an operator used to construct a condition for a query, indicating "greater than or equal to
                },
            },
            limit: limit,
            offset: offset
        });
        console.log(' count:',  count);
        console.log(' rows:',  rows);

        const totalPages = Math.ceil(count / limit);

        res.json({
            expenses: rows,
            pagination: {
                totalExpenses: count,
                totalPages: totalPages,
                currentPage: page
            }
        });
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


function uploadToS3(data, filename){
    //get credentials, login to AWS and upload the file.
    const BUCKET_NAME = 'node-1234vaishnavipublic';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    })

     //params Bucket, Key, Body as required by AWS S3
    const params = {                               
      Bucket: 'node-1234vaishnavipublic',
      Key: filename,
      Body: data,
     // ACL: 'public-read'
    }

    // return promise instead direct return as uploading is an asynchronous task
    return new Promise((resolve, reject)=>{
      s3bucket.upload(params, async (err, s3response)=>{
        try{
          if(err) {
            console.log("Error uploading file", err);
            reject(err);
          }else{
            console.log('File uploaded successfully', s3response)
            resolve(s3response.Location);
          }
        }catch(err){
          console.log("Waiting to login in AWS for upload", err)
        }
     
      })
    })
  }



exports.downloadExpense = async (req, res) =>{
    try{
      const expenses = await req.user.getExpenses();
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `expense${req.user.id}_${new Date()}.txt`;
      const fileUrl = await uploadToS3(stringifiedExpenses, filename);

      res.status(200).json({fileUrl: fileUrl, success:true, filename: filename});

    }catch(err){
      console.log("Error downloading expenses file", err);
      res.status(500).json({error: 'Error downloading expenses'});
    }

  }
