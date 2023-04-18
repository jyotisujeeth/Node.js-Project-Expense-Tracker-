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






exports.updatePassword=(req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}

exports.resetPassword=(req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        console.log("fjjbjbkakbjbkkssjbjbkakj=====>",forgotpasswordrequest)
        if(forgotpasswordrequest){
            console.log("password id======>",id)
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.forgotPassword=async(req,res,next)=>{
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

    
                const tranEmailApi = new Sib.TransactionalEmailsApi()
                const sender = {
                    email: 'jyotisujeeth@gmail.com',
                    name: 'jyotisujeeth',
                }
                const receivers = [
                    {
                        email: `${req.body.email}`,
                    },
                ]
            
            
                tranEmailApi
                    .sendTransacEmail({
                        sender,
                        to: receivers,
                        subject: 'Forgot Password',
                        textContent: `
                        Reset Password
                        `,
                        htmlContent: `<h1>Reset Password</h1>
                        <a href="http://localhost:3000/password/resetpassword/${id}">Reset Link </a>`
                        
                    })
                    .then(console.log)
                    .catch(console.log)
                    res.status(201).json({message: 'Reset Password'})

        }else {
            throw new Error('User doesNot exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, success: false });
    }
}