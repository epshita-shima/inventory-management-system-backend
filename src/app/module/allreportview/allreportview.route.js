const express = require("express");
const router = express.Router();
const ReportManagementController = require("./allreportview.controller");

router.get('/order-details',ReportManagementController.getFiltredForReportInfoController);
router.get('/order-summary',ReportManagementController.getFiltredForOrderSummaryReportInfoController);
router.get('/sales-details',ReportManagementController.getFiltredForSalesDetailsReportInfoController);
router.get('/sales-summary',ReportManagementController.getFiltredForSalesSummaryReportInfoController);
router.get('/return-details',ReportManagementController.getFiltredForReturnDetailsReportInfoController);
router.get('/return-summary',ReportManagementController.getFiltredForReturnSummaryReportInfoController);

module.exports=router