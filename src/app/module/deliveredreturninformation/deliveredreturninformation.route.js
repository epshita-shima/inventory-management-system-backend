const express = require("express");
const router = express.Router();
const ReturnDeliveredController = require("./deliveredreturninformation.controller");

router.get('/',ReturnDeliveredController.getReturnDeliveredInfoController);
router.post('/',ReturnDeliveredController.insertReturnDeliveredInfoController);

module.exports=router