const express = require("express");
const router = express.Router();
const PaymentMethodController = require("./paymentmethodinformation.controller");

router.get('/',PaymentMethodController.getPaymentMethodInfoController);
router.post('/',PaymentMethodController.insertPaymentMethodInfoController);
router.get('/:id',PaymentMethodController.getPaymentMethodInfoByIdController);
router.put('/:id',PaymentMethodController.updatePaymentMethodInfoController);
router.delete('/:id',PaymentMethodController.deletePaymentMethodInfoController)

module.exports=router