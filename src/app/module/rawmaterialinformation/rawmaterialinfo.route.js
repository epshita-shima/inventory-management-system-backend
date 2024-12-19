const express = require("express");
const router = express.Router();

const RawmaterialInfoController = require("./rawmaterialinfo.controller");

router.get('/',RawmaterialInfoController.getItemInfoController);
router.post('/',RawmaterialInfoController.insertItemInfoController);
router.get('/:id',RawmaterialInfoController.getItemInfoByIdController);
router.put('/:id',RawmaterialInfoController.updateItemInformationController);
router.put('/',RawmaterialInfoController.updateItemInformationStatusController)
router.delete('/:id',RawmaterialInfoController.deleteItemInformationController);

module.exports=router