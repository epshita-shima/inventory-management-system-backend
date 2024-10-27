const RetunDeliveredInfoModel = require("./deliveredreturninformation.model");

async function getRetunDeliveredInfoDB() {
  try {
    const deliveryReturnData = await RetunDeliveredInfoModel.find();
    return deliveryReturnData;
  } catch (error) {
    console.error("Error fetching delivery Return data:", error);
  }
}


async function insertRetunDeliveredInfoDB(returnInfo) {
  try {
    return await RetunDeliveredInfoModel.insertMany(returnInfo);
  } catch (error) {
    throw new Error("Error inserting delivery Return Data: " + error.message);
  }
}

async function getReturnDeliveredDataInfoByIdDB(id) {
  try {
    const singleReturnDeliveredInfo = await RetunDeliveredInfoModel.findById(id);
    return singleReturnDeliveredInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}
const deleteReturnDeliveredInfoDB = async (id) => {
  console.log(id)
  try {
    const deleteReturnDeliverInfoData = await RetunDeliveredInfoModel.findByIdAndDelete(id);
    console.log('deleteReturnDeliverInfoData',deleteReturnDeliverInfoData)
    if (!deleteReturnDeliverInfoData) {
      throw new Error("DO info not found");
    }
    return { status: 200, data: deleteReturnDeliverInfoData };
  } catch (error) {
    console.error("Error deleting return delivered info:", error);
    throw new Error("Internal server error");
  }
};
module.exports = {
    getRetunDeliveredInfoDB,
    insertRetunDeliveredInfoDB,
    getReturnDeliveredDataInfoByIdDB,
    deleteReturnDeliveredInfoDB
  };
  