const ProductionInfoModel = require("./productioninfo.model");

async function getProductionInfoDB() {
  try {
    const productionData = await ProductionInfoModel.find();
    return productionData;
  } catch (error) {
    console.error("Error fetching production data:", error);
  }
}

async function getFilteredProductionInfoDB(fromDate, toDate) {
  try {
    console.log('service',fromDate, toDate)
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
    console.error(error);
  }
}
async function insertProductInfoDB(purchaseOrderInfo) {
  console.log(purchaseOrderInfo);
  try {
    return await ProductionInfoModel.insertMany(purchaseOrderInfo);
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

async function getProductionInfoByIdDB(id) {
  try {
    const singleProductionInfo = await ProductionInfoModel.findById(id);
    console.log(singleProductionInfo);
    return singleProductionInfo;
  } catch (error) {
    console.error(error);
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
      console.log("No matching document found for ID:", id);
      return null;
    }

    if (updateProductionInfo) {
      return updateProductionInfo;
    } else {
      console.log("No matching document found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

const deleteProductionInfoDB = async (id) => {
    try {
      const deleteProductionInfoData = await ProductionInfoModel.findByIdAndDelete(id);
      console.log(deleteProductionInfoData, "delete");
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
