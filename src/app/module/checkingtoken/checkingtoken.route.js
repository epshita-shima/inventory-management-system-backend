const express = require("express");
const router = express.Router();
const ChekingTokenController=require('./checkingtoken.service')
const loggerMiddleware=require('../../middlewares/loggerTestMiddleware')

router.post('/',loggerMiddleware,ChekingTokenController.userLogin);

module.exports=router