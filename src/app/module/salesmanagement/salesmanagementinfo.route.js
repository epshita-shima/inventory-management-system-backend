const express = require("express");
const router = express.Router();
const SalesManagementController = require("./salesmanagementinfo.controller");

router.get('/',SalesManagementController.getInvoiceInformationController);
router.post('/',SalesManagementController.insertInvoiceInformationController);
router.get('/filtered',SalesManagementController.getFilteredInvoiceInfoController);
router.get('/report',SalesManagementController.getFiltredForReportInvoiceInfoController);
router.get('/:id',SalesManagementController.getInvoiceInformationByIdController);
router.put('/special-approve',SalesManagementController.updateInvoiceSpecialPIApproveController);
router.put('/shipment',SalesManagementController.updateInvoiceShipmentNoController);
router.put('/:id',SalesManagementController.updateInvoiceInformationController);
router.put('/',SalesManagementController.updateInvoiceStatusController);
router.delete('/:id',SalesManagementController.deleteInvoiceInformationController);

module.exports=router