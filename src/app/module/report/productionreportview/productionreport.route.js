const express = require("express");
const router = express.Router();
const ProductionController=require('./productionreport.controller');

router.get('/datewise-details',ProductionController.getFiltredForProductionDatewiseDetailsReportController);
router.get('/datewise-summary',ProductionController.getFiltredForProductionDatewiseSummaryReportController);
router.get('/itemwise-details',ProductionController.getFiltredForProductionItemwiseSummaryReportController);
router.get('/raw-material-consumption-details',ProductionController.getFiltredForRawMaterialConsumptionDetailsReportController);
router.get('/raw-material-consumption-summary',ProductionController.getFiltredForRawMaterialConsumptionSummaryReportController);

module.exports=router