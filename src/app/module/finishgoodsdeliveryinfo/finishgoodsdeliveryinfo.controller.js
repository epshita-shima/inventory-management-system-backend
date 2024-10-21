const FinishGoodsDeliveryInfoService = require("./finishgoodsdeliveryinfo.service");


async function getFinishGoodsDeliveryInfoController(req, res, next) {
    const data = req.body;
    const finishgoodsInfoData =
      await FinishGoodsDeliveryInfoService.getFinishGoodsDeliverInfoDB(data);
    res.json(finishgoodsInfoData);
  }
  
  const getFilteredFinishGoodsDeliveryInfoController = async (req, res) => {
    console.log(req.query)
    const { clientId,
        approveStatus } = req.query;
    const filteredPaymentReceive =
      await FinishGoodsDeliveryInfoService.getFilteredFinishGoodsDeliverInfoInfoDB(
        clientId,
        approveStatus
      );
    res.json(filteredPaymentReceive);
  };

  module.exports = {getFinishGoodsDeliveryInfoController,getFilteredFinishGoodsDeliveryInfoController}