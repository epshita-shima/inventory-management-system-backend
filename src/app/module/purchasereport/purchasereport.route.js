const express = require("express");
const router = express.Router();
const PurchaseReportController = require("./purchasereport.controller");

router.get('/details',PurchaseReportController.getFiltredForPurchaseSummaryReportController);
router.get('/summary',PurchaseReportController.getFiltredForPurchaseSummaryReportController);

module.exports=router