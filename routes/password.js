const path = require('path');

const express = require('express');
const Sib = require('sib-api-v3-sdk')

const router = express.Router();
const userAuth=require('../middleware/auth');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
require('dotenv').config()
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SIB_KEY



const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

const passwordController = require('../controllers/password');


router.get('/updatepassword/:resetpasswordid',passwordController.updatePassword)

router.get('/resetpassword/:id',passwordController.resetPassword)

router.post('/forgotpassword',passwordController.forgotPassword)


module.exports = router;