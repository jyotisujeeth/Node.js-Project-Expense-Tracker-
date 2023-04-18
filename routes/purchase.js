const express = require('express');

const purchaseController = require('../controllers/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/purchasepremium', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updateTransactionStatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router;