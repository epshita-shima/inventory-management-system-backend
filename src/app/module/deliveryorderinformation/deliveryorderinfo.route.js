const express = require("express");
const router = express.Router();
const DeliveryOrderController = require("./deliveryorderinfo.controlller");

router.get('/',DeliveryOrderController.getDOInfoController);
router.post('/',DeliveryOrderController.insertDOInfoController);


module.exports=router