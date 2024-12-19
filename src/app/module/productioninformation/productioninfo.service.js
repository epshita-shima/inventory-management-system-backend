const ApiError = require("../../../errors/ApiError");
const { errorlogger, logger } = require("../../../shared/logger");
const ProductionInfoModel = require("./productioninfo.model");

async function getProductionInfoDB() {
  try {
    const productionData = await ProductionInfoModel.find();
    return productionData;
  } catch (error) {
    errorlogger.error("Error fetching production data:", error);
  }
}

async function getFilteredProductionInfoDB(fromDate, toDate) {
  try {
    const filter = {};

    if (fromDate && toDate) {
      filter.productionDate = { $gte: fromDate, $lte: toDate };
    }

    if (Object.keys(filter).length === 0 && filter.constructor === Object) {
      return [];
    } else {
      const data = await ProductionInfoModel.find(filter);
      return data;
    }
  } catch (error) {
    errorlogger.error(error);
  }
}
async function insertProductInfoDB(purchaseOrderInfo) {
  try {
    const purchaseInfoInsert= await ProductionInfoModel.insertMany(purchaseOrderInfo);
    if(purchaseInfoInsert){
      return purchaseInfoInsert
    }
    else{
      throw new ApiError(400,'Failed to create')
    }
  } catch (error) {
    throw error
  }
}

async function getProductionInfoByIdDB(id) {
  try {
    const singleProductionInfo = await ProductionInfoModel.findById(id);
    return singleProductionInfo;
  } catch (error) {
    errorlogger.error(error);
    throw new Error("Internal server error from service");
  }
}

async function updateProductionInfoDB(id, data) {
  try {
    const updateProductionInfo = await ProductionInfoModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updateProductionInfo) {
      logger.info("No matching document found for ID:", id);
      return null;
    }

    if (updateProductionInfo) {
      return updateProductionInfo;
    } else {
      logger.info("No matching document found for ID:", id);
      return null;
    }
  } catch (error) {
    errorlogger.error(error);
    throw new Error("Internal server error from service");
  }
}

const deleteProductionInfoDB = async (id) => {
    try {
      const deleteProductionInfoData = await ProductionInfoModel.findByIdAndDelete(id);
      if (!deleteProductionInfoData) {
        throw new Error("PO info not found");
      }
      return deleteProductionInfoData;
    } catch (error) {
      throw new Error("Internal server error");
    }
  };

module.exports = {
  getProductionInfoDB,
  getFilteredProductionInfoDB,
  insertProductInfoDB,
  getProductionInfoByIdDB,
  updateProductionInfoDB,
  deleteProductionInfoDB
};
