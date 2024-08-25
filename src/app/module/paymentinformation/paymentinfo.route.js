const express = require("express");
const router = express.Router();
const PaymentInfoController = require("./payment.controller");

router.get('/',PaymentInfoController.getPaymentInfoController)
router.post('/',PaymentInfoController.createPaymentInfoController);
router.delete('/:id',PaymentInfoController.deletePaymentInfoController);

module.exports=router
