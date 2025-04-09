const RawMaterialConsumptionService=require('./rmconsumptiondetail.service')

const insertRawMaterialConsumptionController = async (req, res, next) => {
  try {
    const data = req.body;
    const itemInfo = await RawMaterialConsumptionService.insertRawMaterialConsumptiontDB(data);
    res.status(200).json({
      status: "success",
      data: itemInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {insertRawMaterialConsumptionController}