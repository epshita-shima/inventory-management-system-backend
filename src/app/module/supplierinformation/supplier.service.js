const SupplierInfoModel = require("./supplier.model");

async function getSupplierInfoDB() {
  try {
    const supplierInfoData = await SupplierInfoModel.find();
    return supplierInfoData;
  } catch (error) {
    console.error("Error fetching supplier:", error);
  }
}

async function insertSupplierInfoDB(supplierData) {
  try {
    return await SupplierInfoModel.insertMany(supplierData);
  } catch (error) {
    throw new Error("Error inserting supplier info: " + error.message);
  }
}

async function getAupplierInfoByIdDB(id) {
  try {
    const singleSupplier = await SupplierInfoModel.findById(id);
    return singleSupplier;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

async function updateSupplierInformationDB(id, data) {
  try {
    const updatedSupplierInfo = await SupplierInfoModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (updatedSupplierInfo) {
      return updatedSupplierInfo;
    } else {
      console.log("No matching document found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

async function updateSupplierInformationStatusDB(data) {
  try {
    const promises = data?.map(async (updateStatus) => {
      // Update isactive field for each user
      const updatedStatusData = await SupplierInfoModel.findByIdAndUpdate(
        updateStatus._id,
        { isActive: updateStatus.isActive },
        { new: true }
      );
      return updatedStatusData;
    });
    const updatedStatusData = await Promise.all(promises);
    return updatedStatusData;
  } catch (error) {
    console.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
  }
}

const deleteSupplierInformationDB = async (id) => {
  try {
    const deleteSupplierInfoData = await SupplierInfoModel.findByIdAndDelete(
      id
    );
    if (!deleteSupplierInfoData) {
      throw new Error("Supplier not found");
    }
    return deleteSupplierInfoData;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

module.exports = {
  getSupplierInfoDB,
  insertSupplierInfoDB,
  getAupplierInfoByIdDB,
  updateSupplierInformationDB,
  updateSupplierInformationStatusDB,
  deleteSupplierInformationDB,
};
