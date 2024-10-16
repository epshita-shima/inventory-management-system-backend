const DOInfoModel = require("./deliveryorderinfo.module");

async function getDOInfoDB() {
    try {
      const deliveryData = await DOInfoModel.find({ deliveryStatus: false });
      return deliveryData;
    } catch (error) {
      console.error("Error fetching production data:", error);
    }
  }

async function insertDOInfoInfoDB(doInfo) {
  try {
    return await DOInfoModel.insertMany(doInfo);
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

module.exports = {getDOInfoDB, insertDOInfoInfoDB };
