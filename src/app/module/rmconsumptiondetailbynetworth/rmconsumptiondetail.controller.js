const RawMaterialConsumptionService = require("./rmconsumptiondetail.service");

const getRawMaterialConsumptionController = async (req, res, next) => {
  try {
    const rawConsumptionData = req.body;
    const rawConsumption =
      await RawMaterialConsumptionService.getRawMaterialConsimptionDB(
        rawConsumptionData
      );
      res.json(rawConsumption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const insertRawMaterialConsumptionController = async (req, res, next) => {
  try {
    const data = req.body;
    const itemInfo =
      await RawMaterialConsumptionService.insertRawMaterialConsumptiontDB(data);
    res.status(200).json({
      status: "success",
      data: itemInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getRawMaterialConsumptionController,
  insertRawMaterialConsumptionController,
};
