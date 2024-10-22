const FinishGoodsDeliveryInfoService = require("./finishgoodsdeliveryinfo.service");

async function getFinishGoodsDeliveryInfoController(req, res, next) {
  const data = req.body;
  const finishgoodsInfoData =
    await FinishGoodsDeliveryInfoService.getFinishGoodsDeliverInfoDB(data);
  res.json(finishgoodsInfoData);
}

const getFilteredFinishGoodsDeliveryInfoController = async (req, res) => {
  console.log(req.query);
  const { clientId, approveStatus } = req.query;
  const filteredPaymentReceive =
    await FinishGoodsDeliveryInfoService.getFilteredFinishGoodsDeliverInfoDB(
      clientId,
      approveStatus
    );
  res.json(filteredPaymentReceive);
};

async function insertFinishGoodsDeliverInfoController(req, res) {
  console.log('req insert',req.body)
  try {
    const insertedFinishGoodsDeliverInfoInfo =
      await FinishGoodsDeliveryInfoService.insertFinishGoodsDeliverInfoDB(
        req.body
      );
    res.status(200).json(insertedFinishGoodsDeliverInfoInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getFinishGoodsDeliverInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleDataInfo =
      await FinishGoodsDeliveryInfoService.getFinishGoodsDeliverInfoByIdDB(id);
    if (!singleDataInfo) {
      return res.status(404).json({ message: "Finish Goods Deliver info not found" });
    }
    return res.status(200).json(singleDataInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getFinishGoodsDeliveryInfoController,
  getFilteredFinishGoodsDeliveryInfoController,
  insertFinishGoodsDeliverInfoController,
  getFinishGoodsDeliverInfoByIdController,
};
