const SalesManagemnetModel = require("./salesmanagementinfo.model");

async function getInvoiceInformationDB() {
  try {
    const salesData = await SalesManagemnetModel.find();
    return salesData;
  } catch (error) {
    console.error("Error fetching production data:", error);
  }
}



async function insertInvoiceInformationDB(purchaseOrderInfo) {
  console.log(purchaseOrderInfo);
  try {
    return await SalesManagemnetModel.insertMany(purchaseOrderInfo);
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

async function getInvoiceInformationByIdDB(id) {
  try {
    const singleInvoiceInfo = await SalesManagemnetModel.findById(id);
    console.log(singleInvoiceInfo);
    return singleInvoiceInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

async function updateInvoiceInformationDB(id, data) {
  try {
    const updateInvoiceInfo = await SalesManagemnetModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updateInvoiceInfo) {
      console.log("No matching document found for ID:", id);
      return null;
    }

    if (updateInvoiceInfo) {
      return updateInvoiceInfo;
    } else {
      console.log("No matching document found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

const deleteInvoiceInformationDB = async (id) => {
    try {
      const deleteInvoiceInfoData = await SalesManagemnetModel.findByIdAndDelete(id);
      console.log(deleteInvoiceInfoData, "delete");
      if (!deleteInvoiceInfoData) {
        throw new Error("PO info not found");
      }
      return deleteInvoiceInfoData;
    } catch (error) {
      throw new Error("Internal server error");
    }
  };

module.exports = {
  getInvoiceInformationDB,
  insertInvoiceInformationDB,
  getInvoiceInformationByIdDB,
  updateInvoiceInformationDB,
  deleteInvoiceInformationDB
};
