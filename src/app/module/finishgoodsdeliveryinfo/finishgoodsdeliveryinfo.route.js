const express = require("express");
const router = express.Router();
const FinishGoodsDeliveryController = require("./finishgoodsdeliveryinfo.controller");

router.get('/',FinishGoodsDeliveryController.getFinishGoodsDeliveryInfoController);
router.get('/filtered',FinishGoodsDeliveryController.getFilteredFinishGoodsDeliveryInfoController);
router.post('/',FinishGoodsDeliveryController.insertFinishGoodsDeliverInfoController);
router.get('/:id',FinishGoodsDeliveryController.getFinishGoodsDeliverInfoByIdController);

module.exports=router