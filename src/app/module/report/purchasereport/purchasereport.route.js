const express = require("express");
const router = express.Router();
const PurchaseReportController = require("./purchasereport.controller");

router.get('/details',PurchaseReportController.getFiltredForPurchaseDetailsReportController);
router.get('/summary',PurchaseReportController.getFiltredForPurchaseSummaryReportController);

module.exports=router