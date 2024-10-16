const DOInfoService = require("./deliveryorderinfo.service");


async function getDOInfoController(req, res, next) {
    const data = req.body;
    const doInfoData =
      await DOInfoService.getDOInfoDB(data);
    res.json(doInfoData);
  }
  

async function insertDOInfoController(req, res) {
    try {
      const insertedDOInfo =
        await DOInfoService.insertDOInfoInfoDB(req.body);
      res.status(200).json(insertedDOInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

  

  module.exports = {getDOInfoController,insertDOInfoController}