const express = require("express");
const router = express.Router();
const SalesTotalService=require('./chart.controller')

router.get('/sales-total',SalesTotalService.getFiltredForSalesTotalController);

module.exports=router