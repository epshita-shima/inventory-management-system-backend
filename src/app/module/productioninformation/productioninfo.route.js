const express = require("express");
const router = express.Router();
const ProductController = require("./productioninfo.controller");

router.get('/',ProductController.getProductionInfoController);
router.get('/filtered',ProductController.getFilteredProductionInfoController);
router.post('/',ProductController.insertProductInfoController);
router.get('/:id',ProductController.getProductionInfoByIdController);
router.put('/:id',ProductController.updateProductionInfoController);
router.delete('/:id',ProductController.deleteProductionInfoController)

module.exports=router