const SalesManagementModel = require("./salesmanagementinfo.model");

async function getInvoiceInformationDB() {
  try {
    const salesData = await SalesManagementModel.find();
    return salesData;
  } catch (error) {
    console.error("Error fetching production data:", error);
  }
}

async function insertInvoiceInformationDB(purchaseOrderInfo) {
  console.log(purchaseOrderInfo);
  try {
    return await SalesManagementModel.insertMany(purchaseOrderInfo);
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

async function getFilteredInvoiceInfoDB(customerID) {
  try {
    const data = await SalesManagementModel.find({ customerID: customerID });
    return data;
  } catch (error) {
    console.error("Error querying data:", error);
    throw error;
  }
}

async function getInvoiceInformationByIdDB(id) {
  try {
    const singleInvoiceInfo = await SalesManagementModel.findById(id);
    console.log(singleInvoiceInfo);
    return singleInvoiceInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

async function updateSpecialInvoiceApproveDB(dataArray) {
  try {
    const updatePromises = dataArray.map(async (data) => {
      const result = await SalesManagementModel.updateOne(
        {
          _id: data._id,
          "detailsData._id": data.detailsData._id, // Match the specific detailsData item
        },
        {
          $set: {
            "detailsData.$.specialApproveForDelivary":
              data.detailsData.specialApproveForDelivary,
            "detailsData.$.specialApproveBy": data.detailsData.specialApproveBy,
            "detailsData.$.specialApproveDate":
              data.detailsData.specialApproveDate,
          },
        }
      );
      console.log(`Updated document with _id: ${data._id}`, result);
      return result;
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    return results;
  } catch (error) {
    console.error("Error updating special approve fields:", error);
    throw new Error("Failed to update special approve fields");
  }
}

async function updateInvoiceShipmentNoDB(data) {
  try {
    const updatedStatusData = await SalesManagementModel.findByIdAndUpdate(
      data._id,
      { shipmentNo: data.shipmentNo + 1},
      { new: true }
    );
    console.log('data.shipmentNo',updatedStatusData)
    return updatedStatusData;
  } catch (error) {
    console.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
  }
}

async function updateInvoiceInformationDB(id, data) {
  try {
    const updateInvoiceInfo = await SalesManagementModel.findByIdAndUpdate(
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

async function updateInvoicePIStatusDB(data) {
  try {
    const updatedStatusData = await SalesManagementModel.findByIdAndUpdate(
      data._id,
      { isApproved: data.isApproved },
      { approveBy: data.approveBy },
      { approveDate: data.approveDate },
      { shipmentNo: data.shipmentNo + 1},
      { new: true }
    );

    return updatedStatusData;
  } catch (error) {
    console.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
  }
}


const deleteInvoiceInformationDB = async (id) => {
  try {
    const deleteInvoiceInfoData = await SalesManagementModel.findByIdAndDelete(
      id
    );
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
  getFilteredInvoiceInfoDB,
  getInvoiceInformationByIdDB,
  updateInvoiceInformationDB,
  updateInvoicePIStatusDB,
  updateSpecialInvoiceApproveDB,
  updateInvoiceShipmentNoDB,
  deleteInvoiceInformationDB,
};
