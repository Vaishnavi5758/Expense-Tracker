const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const { DataTypes } = require('sequelize'); 
const User = require('./user-model'); 

const Expense = sequelize.define('expenses', {
   
    amount: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false // Disables createdAt and updatedAt
});

//Expense.belongsTo(User, { foreignKey: 'id' }); 
module.exports = Expense;
