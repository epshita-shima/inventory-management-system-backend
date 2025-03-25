const express = require("express");
const router = express.Router();
const PurchaseReportController = require("./purchasereport.controller");

router.get('/details',PurchaseReportController.getFiltredForPurchaseDetailsReportController);
router.get('/summary',PurchaseReportController.getFiltredForPurchaseSummaryReportController);
router.get('/single-item',PurchaseReportController.getFiltredForPurchaseItemReportController);

module.exports=router