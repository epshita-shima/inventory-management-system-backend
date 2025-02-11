const CFTInfosModal = require("./cft.model");

async function getCFTInfosDB(){
    try {
        const CFTInfos = await CFTInfosModal.find();
        return CFTInfos;
      } catch (error) {
        console.log("Error fetching item size:", error);
      }
}

async function insertCFTInfosDB(cftData) {
    try {
      return await CFTInfosModal.insertMany(cftData);
    } catch (error) {
      throw new Error("Error inserting cft info Data: " + error.message);
    }
  }

  async function getCFTInfosByIdDB(id) {
    try {
      const singleCFTData = await CFTInfosModal.findById(id);
      return singleCFTData;
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error from service");
    }
  }
  
  async function updateCFTInfosDB(id, data) {
    try {
      const updateCFTInfo = await CFTInfosModal.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
      if (updateCFTInfo) {
        return updateCFTInfo;
      } else {
        console.log("No matching document found for ID:", id);
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error from service");
    }
  }

  async function updateCFTInfosStatusDB( data) {
    console.log('new date',new Date().toLocaleDateString('en-CA'))
    try {
      const promises = data?.map(async (updateStatus) => {
        // Update isactive field for each user
        const updatedStatusData = await CFTInfosModal.findByIdAndUpdate(
          updateStatus._id,
          { isActive: updateStatus.isActive ,closingDate:new Date().toLocaleDateString('en-CA')},
          { new: true }
        );
        return updatedStatusData;
      });
      const updatedStatusData = await Promise.all(promises);
      return updatedStatusData;
    } catch (error) {
      console.log("Error updating multiple users:", error);
      throw new Error("Failed to update multiple data");
    }
  }
  
  const deleteCFTInfosDB = async (id) => {
    try {
      const deleteCFTInfoData= await CFTInfosModal.findByIdAndDelete(id);
      if (!deleteCFTInfoData) {
        throw new Error("Item not found");
      }
      return deleteCFTInfoData;
    } catch (error) {
      throw new Error("Internal server error");
    }
  };
  
  module.exports = {
    getCFTInfosDB,
    insertCFTInfosDB,
    getCFTInfosByIdDB,
    updateCFTInfosDB,
    updateCFTInfosStatusDB,
    deleteCFTInfosDB
  }