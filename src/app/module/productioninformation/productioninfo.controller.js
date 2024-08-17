const ProductionInfoService = require("./productioninfo.service");

async function getProductionInfoController(req, res, next) {
    const data = req.body;
    const productionData = await ProductionInfoService.getProductionInfoDB(data);
    res.json(productionData);
  }

async function insertProductInfoController(req, res) {
    try {
      const insertedProduction = await ProductionInfoService.insertProductInfoDB(
        req.body
      );
      res.status(200).json(insertedProduction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  const getFilteredProductionInfoController = async (req, res, next) => {
    console.log('data',req.body)
    const {fromDate, toDate } = req.body;
  console.log('contoller',fromDate,toDate)
    const filteredProductionData =
      await ProductionInfoService.getFilteredProductionInfoDB(
        fromDate,
        toDate,
      );
    res.json(filteredProductionData);
  };
  

  const getProductionInfoByIdController = async (req, res) => {
    const { id } = req.params;
    try {
      const singleProductionInfo =
        await ProductionInfoService.getProductionInfoByIdDB(id);
      if (!singleProductionInfo) {
        return res.status(404).json({ message: "Production info not found" });
      }
      return res.status(200).json(singleProductionInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  const updateProductionInfoController = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const updateProductionData = req.body; // Assuming the updated data is sent in the request body
      console.log("updatedData", updateProductionData);
      const result = await ProductionInfoService.updateProductionInfoDB(
        id,
        updateProductionData
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deleteProductionInfoController = async (req, res) => {
    const { id } = req.params;
    try {
      const productionInfo = await ProductionInfoService.deleteProductionInfoDB(id);
      return res.status(200).json(productionInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  module.exports={getProductionInfoController,insertProductInfoController,getFilteredProductionInfoController,getProductionInfoByIdController,updateProductionInfoController,deleteProductionInfoController}