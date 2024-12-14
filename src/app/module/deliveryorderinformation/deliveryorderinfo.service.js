const { errorlogger } = require("../../../shared/logger");
const DOInfoModel = require("./deliveryorderinfo.module");

async function getDOInfoDB() {
  try {
    const deliveryData = await DOInfoModel.find();
    return deliveryData;
  } catch (error) {
    errorlogger.error("Error fetching production data:", error);
  }
}
async function getDOAfterDeliverInfoDB() {
  try {
    const deliveryData = await DOInfoModel.find({ deliveryStatus: true });
    return deliveryData;
  } catch (error) {
   errorlogger.error("Error fetching production data:", error);
  }
}

async function getFilteredDOApproveInfoDB(approveStatus) {
  try {
    const data = await DOInfoModel.find({ approveStatus: approveStatus });
    return data;
  } catch (error) {
   errorlogger.error("Error querying data:", error);
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
    errorlogger.error(error);
    throw new Error("Internal server error from service");
  }
}

async function getDOSingleInfoByIdDB(id) {
  try {
    const singleDOInfo = await DOInfoModel.findById(id);
    return singleDOInfo;
  } catch (error) {
    errorlogger.error(error);
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
    return result;

    // const results = await Promise.all(updatePromises);
    // return results;
  } catch (error) {
    errorlogger.error("Error updating special approve fields:", error);
    throw new Error("Failed to update special approve fields");
  }
}

async function updateDOStatusDB(data) {
  try {
    const updatedStatusData = await DOInfoModel.findByIdAndUpdate(
      data._id,
      { deliveryStatus: data.deliveryStatus },
      { new: true }
    );
    return updatedStatusData;
  } catch (error) {
    errorlogger.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
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
  getDOAfterDeliverInfoDB,
  insertDOInfoInfoDB,
  getDOInfoByIdDB,
  getDOSingleInfoByIdDB,
  getFilteredDOApproveInfoDB,
  updateDOApproveStatusDB,
  updateDOStatusDB,
  deleteDOInfoDB,
};
