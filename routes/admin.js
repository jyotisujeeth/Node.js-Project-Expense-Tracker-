const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const router = express.Router();
const userAuth=require('../middleware/auth');
const Expense = require('../models/expense');


const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/download',userAuth.authenticate, adminController.download)

router.post('/add-expense',userAuth.authenticate ,adminController.postAddExpense)

router.get('/get-expenses',userAuth.authenticate ,adminController.getExpenses)

router.delete('/delete-expense/:id',userAuth.authenticate ,adminController.deleteExpense)

module.exports = router;















// app.post('/admin/add-expense',async (req,res,next)=>{
//     try{
//         var amount=req.body.amount;
//         var Description=req.body.Description;
//         var category=req.body.category;
//         const data= await Expense.create({amount:amount, Description:Description, category:category})
//         res.status(201).json({newExpenseDetail:data})
//     }
//     catch(err){
//         res.status(500).json({
//             error:err
//         })
//     }
// })


// app.get('/admin/get-expenses', async (req,res,next)=>{
//     try{
//         const expenses=await Expense.findAll();
//         res.status(200).json({allExpenses:expenses})
//     }
//     catch(error){
//         console.log("Get expense is failing",JSON.stringify(error));
//         res.status(500).json({
//             error:error
//         })
//     }
    
// })

// app.delete('/admin/delete-expense/:id',async(req,res,next)=>{
//     try{
//         const uId=req.params.id;
//         console.log(uId);
//         await Expense.destroy({where:{id:uId}});
//         res.sendStatus(200);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json(err);
//     }
    
// })