const express = require("express");
const router = express.Router();
const ReturnDeliveredController = require("./deliveredreturninformation.controller");

router.get('/',ReturnDeliveredController.getReturnDeliveredInfoController);
router.post('/',ReturnDeliveredController.insertReturnDeliveredInfoController);
router.get('/:id',ReturnDeliveredController.getReturnDeliveredDataInfoByIdController);
router.delete('/:id',ReturnDeliveredController.deleteReturnDeliveredInfoController);

module.exports=router