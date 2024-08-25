const express = require("express");
const router = express.Router();
const SalesManagementController = require("./salesmanagementinfo.controller");

router.get('/',SalesManagementController.getInvoiceInformationController);
router.post('/',SalesManagementController.insertInvoiceInformationController);
router.get('/:id',SalesManagementController.getInvoiceInformationByIdController);
router.put('/:id',SalesManagementController.updateInvoiceInformationController);
router.delete('/:id',SalesManagementController.deleteInvoiceInformationController)

module.exports=router