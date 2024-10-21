const DOInfoModel = require("./deliveryorderinfo.module");

async function getDOInfoDB() {
  try {
    const deliveryData = await DOInfoModel.find({ deliveryStatus: false });
    return deliveryData;
  } catch (error) {
    console.error("Error fetching production data:", error);
  }
}

async function getFilteredDOApproveInfoDB(approveStatus) {
  try {
    const data = await DOInfoModel.find({ approveStatus: approveStatus });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error querying data:", error);
    throw error;
  }
}

async function insertDOInfoInfoDB(doInfo) {
  try {
    return await DOInfoModel.insertMany(doInfo);
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

async function getDOInfoByIdDB(id) {
  try {
    const singleDOInfo = await DOInfoModel.findById(id);
    return singleDOInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

async function updateDOApproveStatusDB(data) {
  try {
 
      const result = await DOInfoModel.updateOne(
        {
          _id: data._id,
        },
        {
          $set: {
            approveStatus: data.approveStatus,
            approveBy: data.approveBy,
            approveDate: data.approveDate,
          },
        }
      );
      console.log(`Updated document with _id: ${data._id}`, result);
      return result;
 
    // const results = await Promise.all(updatePromises);
    // return results;
  } catch (error) {
    console.error("Error updating special approve fields:", error);
    throw new Error("Failed to update special approve fields");
  }
}

const deleteDOInfoDB = async (id) => {
  try {
    const deleteDOInfoData = await DOInfoModel.findByIdAndDelete(id);
    if (!deleteDOInfoData) {
      throw new Error("DO info not found");
    }
    return deleteDOInfoData;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

module.exports = {
  getDOInfoDB,
  insertDOInfoInfoDB,
  getDOInfoByIdDB,
  getFilteredDOApproveInfoDB,
  updateDOApproveStatusDB,
  deleteDOInfoDB,
};
