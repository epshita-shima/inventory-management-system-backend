const express = require("express");
const router = express.Router();
const DeliveryOrderController = require("./deliveryorderinfo.controlller");

router.get('/',DeliveryOrderController.getDOInfoController);
router.get('/after-deliver',DeliveryOrderController.getDOAfterDeliverInfoController);
router.get('/filtered',DeliveryOrderController.getFilteredDOApproveInfoController);
router.post('/',DeliveryOrderController.insertDOInfoController);
router.get('/:id',DeliveryOrderController.getDOInfoController);
router.get('/single-info',DeliveryOrderController.getDOSingleInfoByIdController);
router.put('/approve-status',DeliveryOrderController.updateDOApproveStatusController);
router.put('/delivery-status',DeliveryOrderController.updateDOStatusController);
router.put('/return-status',DeliveryOrderController.updateDOReturnStatusController);
router.delete('/:id',DeliveryOrderController.deleteDOInfoController);

module.exports=router