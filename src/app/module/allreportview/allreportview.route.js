const express = require("express");
const router = express.Router();
const ReportManagementController = require("./allreportview.controller");

router.get('/',ReportManagementController.getFiltredForReportInvoiceInfoController);

module.exports=router