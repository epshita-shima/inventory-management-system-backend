const express = require("express");
const router = express.Router();
const PaymentMethodController = require("./paymentmethodinformation.controller");

router.get('/',PaymentMethodController.getPaymentMethodInfoController);
router.get('/filtered',PaymentMethodController.getFilteredPaymentMethodInfoController);
router.post('/',PaymentMethodController.insertPaymentMethodInfoController);
router.get('/:id',PaymentMethodController.getPaymentMethodInfoByIdController);
router.put('/',PaymentMethodController.updatePreviousPaymentMethodInfoController);
router.delete('/',PaymentMethodController.deletePaymentMethodInfoController);

module.exports=router