const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');
const authmiddleware = require('../middleware/auth');

router.get('/premiummembership', authmiddleware.authenticate, purchaseController.purchasePremium);
router.post('/updatetransactionstatus', authmiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router;
