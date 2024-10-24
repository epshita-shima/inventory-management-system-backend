const DOInfoModel = require("./deliveryorderinfo.module");

async function getDOInfoDB() {
  try {
    const deliveryData = await DOInfoModel.find({ deliveryStatus: false });
    return deliveryData;
  } catch (error) {
    console.error("Error fetching production data:", error);
  }
}
async function getDOAfterDeliverInfoDB() {
  try {
    const deliveryData = await DOInfoModel.find({ deliveryStatus: true });
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
async function getDOSingleInfoByIdDB(id) {
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

async function updateDOStatusDB(data) {
  try {
    const updatedStatusData = await DOInfoModel.findByIdAndUpdate(
      data._id,
      { deliveryStatus: data.deliveryStatus },
      { new: true }
    );
    console.log("data.delivery status", updatedStatusData);
    return updatedStatusData;
  } catch (error) {
    console.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
  }
}

// async function updateDOReturnStatusDB(data) {
//   console.log("do return",data)
//   try {
//     // const updatedStatusData = await DOInfoModel.updateOne(
//     //   { "detailsData._id": detail._id },
//     //   { $pull: { detailsData: { _id: detail._id } } }
    
//     // );
//     // console.log("data.delivery status", updatedStatusData);
//     // return updatedStatusData;
//     for (const detail of data) {
//           await DOInfoModel.updateOne(
//             { "detailsData._id": detail._id },
//             { $pull: { detailsData: { _id: detail._id } } }
//           );
//         }

//   } catch (error) {
//     console.error("Error updating multiple users:", error);
//     throw new Error("Failed to update multiple data");
//   }
// }

async function updateDOReturnStatusDB(data) {
  console.log("do return", data);
  try {
    // Loop through each item in the `detailsData` array
    for (const detail of data.detailsData) {
      // Update the `returnStatus` for each item in `detailsData` by its `_id`
      const updatedStatusData = await DOInfoModel.updateOne(
        { "detailsData._id": detail._id }, // Match the specific item
        {
          $set: {
            "detailsData.$.returnStatus": detail.returnStatus // Update the `returnStatus` field
          }
        }
      );
      console.log("Updated delivery status for detail:", detail._id, updatedStatusData);
    }
    return { success: true, message: "Return status updated successfully" };
  } catch (error) {
    console.error("Error updating return status:", error);
    throw new Error("Failed to update return status for detailsData");
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
  updateDOReturnStatusDB,
  deleteDOInfoDB,
};
