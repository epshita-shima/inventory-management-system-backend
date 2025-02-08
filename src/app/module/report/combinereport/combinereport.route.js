const express = require("express");
const router = express.Router();
const CombineController=require('./combinereport.controller');

router.get('/',CombineController.getFiltredForManagementCombineReportController);

module.exports=router