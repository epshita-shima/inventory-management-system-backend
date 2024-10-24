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

module.exports = {
    getReturnDeliveredInfoController,
    insertReturnDeliveredInfoController
}