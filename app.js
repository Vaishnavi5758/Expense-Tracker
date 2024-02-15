const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const cors = require('cors');
require('dotenv').config();


const expenseRoutes = require('./routes/expense');
const signUpLoginRoutes = require('./routes/user');
const purchaseRouter = require('./routes/purchase');
const passwordRouter = require('./routes/password');
const Resetpassword = require('./models/password-model');




app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.static('images'));

app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware for parsing JSON in the request body
app.use(express.json());


// Use the userRoutes middleware
app.use(expenseRoutes);
app.use(signUpLoginRoutes);
app.use(purchaseRouter);
app.use( passwordRouter)




//import models and database
const User = require ('./models/user-model');
const Expense = require('./models/expense-model');
const Order = require('./models/order-model')


//any model relations
// User model
User.hasMany(Expense);
Expense.belongsTo(User); 
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Resetpassword);
Resetpassword.belongsTo(User);




// Protected route example
app.get('/protected', (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});





sequelize
  .sync()
  .then(result => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });
