const path = require('path');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));
const userController = require('../controllers/user');

const User = require('../models/user');



router.post('/signup',userController.postSignup)



router.post('/login',userController.postLogin)



module.exports = router;