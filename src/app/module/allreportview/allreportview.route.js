const express = require("express");
const router = express.Router();
const ReportManagementController = require("./allreportview.controller");

router.get('/',ReportManagementController.getFiltredForReportInfoController);
router.get('/order-summary',ReportManagementController.getFiltredForOrderSummaryReportInfoController);
router.get('/sales-summary',ReportManagementController.getFiltredForSalesSummaryReportInfoController);

module.exports=router