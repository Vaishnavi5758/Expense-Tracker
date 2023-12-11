const path = require('path');

const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/signUpLogin', userController.signUpLogin);

router.post('/signUp', userController.signUp);

router.post('/login', userController.login);


module.exports = router;