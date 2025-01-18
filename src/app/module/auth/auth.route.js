const express = require("express");
const router = express.Router();
const ChekingTokenController=require('./auth.service');
const loggerMiddleware=require('../../middlewares/loggerTestMiddleware');

router.post('/',loggerMiddleware,ChekingTokenController.userLogin);
router.post('/logout',ChekingTokenController.userLogout);

module.exports=router;