const express = require("express");
const router = express.Router();
const ProductionController=require('./productionreport.controller');

router.get('/datewise-details',ProductionController.getFiltredForProductionDatewiseDetailsReportController);
router.get('/datewise-summary',ProductionController.getFiltredForProductionDatewiseSummaryReportController)

module.exports=router