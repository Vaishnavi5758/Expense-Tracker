// User model in models/User.js
const Sequelize  = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('users', {
 
  userName: {
    type: Sequelize.STRING
   
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },

  total: 
  {type: Sequelize.INTEGER, defaultValue: 0},


incomeTotal : {type: Sequelize.INTEGER, defaultValue: 0},
}, 

{ timestamps: false} //disables createdat and updatedat
)
module.exports = User;
