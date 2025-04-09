const express = require("express");
const router = express.Router();

const RawMaterialConsumptionController=require('./rmconsumptiondetail.controller')

router.post('/',RawMaterialConsumptionController.insertRawMaterialConsumptionController);

module.exports=router