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

module.exports = {
    getRetunDeliveredInfoDB,
    insertRetunDeliveredInfoDB
  };
  