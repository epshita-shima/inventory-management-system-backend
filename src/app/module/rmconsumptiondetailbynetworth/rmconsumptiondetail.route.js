const express = require("express");
const router = express.Router();

const RawMaterialConsumptionController=require('./rmconsumptiondetail.controller')

router.get('/',RawMaterialConsumptionController.getRawMaterialConsumptionController);
router.post('/',RawMaterialConsumptionController.insertRawMaterialConsumptionController);

module.exports=router