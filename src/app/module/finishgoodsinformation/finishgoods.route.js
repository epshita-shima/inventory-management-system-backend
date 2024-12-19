const express = require("express");
const router = express.Router();

const FinishGoodItemInfoController = require("./finishgoods.controller");

router.get('/',FinishGoodItemInfoController.getItemInfoController);
router.post('/',FinishGoodItemInfoController.insertItemInfoController);
router.get('/:id',FinishGoodItemInfoController.getItemInfoByIdController);
router.put('/:id',FinishGoodItemInfoController.updateItemInformationController);
router.put('/',FinishGoodItemInfoController.updateItemInformationStatusController)
router.delete('/:id',FinishGoodItemInfoController.deleteItemInformationController);

module.exports=router