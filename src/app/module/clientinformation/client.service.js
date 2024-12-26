const ClientInfoModel = require('./client.model');


async function getClientInfoDB() {
    try {
      const clientInfoData = await ClientInfoModel.find();
      return clientInfoData;
    } catch (error) {
      console.log("Error fetching client:", error);
    }
  }


async function insertClientInfoDB(clientData){
    try {
        return await ClientInfoModel.insertMany(clientData)
    } catch (error) {
        throw new Error("Error inserting client info: " + error.message);
    }
}

async function getClientInfoByIdDB(id) {
    try {
      const singleclient = await ClientInfoModel.findById(id);
      return singleclient;
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error from service");
    }
  }

  async function updateClientInformationDB(id, data) {
    try {
      const updatedclientInfo = await ClientInfoModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
      if (updatedclientInfo) {
        return updatedclientInfo;
      } else {
        console.log("No matching document found for ID:", id);
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error from service");
    }
  }

  async function updateClientInformationStatusDB( data) {
    try {
      const promises = data?.map(async (updateStatus) => {
        // Update isactive field for each user
        const updatedStatusData = await ClientInfoModel.findByIdAndUpdate(
          updateStatus._id,
          { isActive: updateStatus.isActive },
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

  const deleteClientInformationDB = async (id) => {
    try {
      const deleteclientInfoData= await ClientInfoModel.findByIdAndDelete(id);
      if (!deleteclientInfoData) {
        throw new Error("client not found");
      }
      return deleteclientInfoData;
    } catch (error) {
      throw new Error("Internal server error");
    }
  };
  
module.exports = {getClientInfoDB,insertClientInfoDB,getClientInfoByIdDB,updateClientInformationDB,updateClientInformationStatusDB,deleteClientInformationDB}