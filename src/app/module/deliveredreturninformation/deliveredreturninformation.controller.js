const ReturnDeliveredInfoService = require("./deliveredreturninformation.service");

async function getReturnDeliveredInfoController(req, res, next) {
    const data = req.body;
    const returnDeliveredInfoData =
      await ReturnDeliveredInfoService.getRetunDeliveredInfoDB(data);
    res.json(returnDeliveredInfoData);
  }
  
async function insertReturnDeliveredInfoController(req, res) {
    console.log('return deliver',req.body)
    try {
      const insertedReturnDeliveredInfo =
        await ReturnDeliveredInfoService.insertRetunDeliveredInfoDB(req.body);
      res.status(200).json(insertedReturnDeliveredInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const getReturnDeliveredDataInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleReturnDeliverInfo = await ReturnDeliveredInfoService.getReturnDeliveredDataInfoByIdDB(id);
    if (!singleReturnDeliverInfo) {
      return res.status(404).json({ message: "DO info not found" });
    }
    return res.status(200).json(singleReturnDeliverInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteReturnDeliveredInfoController = async (req, res) => {
  const { id } = req.params;
  try {
    const returnDeliverInfo = await ReturnDeliveredInfoService.deleteReturnDeliveredInfoDB(id);
    return res.status(200).json(returnDeliverInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    getReturnDeliveredInfoController,
    insertReturnDeliveredInfoController,
    getReturnDeliveredDataInfoByIdController,
    deleteReturnDeliveredInfoController
}