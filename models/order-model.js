const Sequelize = require('sequelize');
const User = require('./user-model');
const sequelize = require('../utils/database');

  const Order = sequelize.define('orders', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    paymentid:Sequelize.STRING,
    orderid:Sequelize.STRING,
    status:Sequelize.STRING,

  });

//User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;