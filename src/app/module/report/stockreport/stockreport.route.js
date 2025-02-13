const express = require("express");
const router = express.Router();
const StockReportController=require('./stockreport.controller');

router.get('/raw--material-stock-report',StockReportController.getFiltredForStockReportInfoController);
router.get('/finish-goods-stock-report',StockReportController.getFiltredForFinishStockReportInfoController);

module.exports=router