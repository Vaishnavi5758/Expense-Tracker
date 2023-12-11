const Sequelize = require('sequelize');


// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql'
// })

//module.exports = sequelize;




const sequelize = new Sequelize('expense-tracker', 'root', 'Suyogniwas57@', {
  dialect: 'mysql',
  host: 'localhost'

  
});

module.exports = sequelize;
