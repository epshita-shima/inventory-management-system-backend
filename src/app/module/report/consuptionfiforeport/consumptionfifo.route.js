const express=require('express');
const router=express.Router()
const ConsumptionController=require('./consumptionfifo.controller');

router.get('/',ConsumptionController.getConsumptionController)

module.exports=router
