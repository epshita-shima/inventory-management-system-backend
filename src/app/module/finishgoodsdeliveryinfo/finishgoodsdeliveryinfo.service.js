
const FinishGoodsDeliveryInfoModel = require("./finishgoodsdeliveryinfo.model");
const DeliveryOrderInfoModal = require('../deliveryorderinformation/deliveryorderinfo.module');

async function getFinishGoodsDeliverInfoDB() {
    try {
      const deliveryData = await FinishGoodsDeliveryInfoModel.find();
      return deliveryData;
    } catch (error) {
      console.error("Error fetching production data:", error);
    }
  }
  
  async function getFilteredFinishGoodsDeliverInfoDB(clientId,approveStatus) {
    try {
        const filter = {};
        if (clientId) {
          filter.clientId = clientId;
        }
    
        if (approveStatus) {
          filter.approveStatus = approveStatus;
        }
          console.log('filter', filter);
      
        if (Object.keys(filter).length === 0) {
          return [];
        }
        console.log('filter.approveStatus type:', typeof filter.approveStatus);
    
        const data = await DeliveryOrderInfoModal.find(filter);
        console.log('data',data)
        return data;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching payment method info");
      }
  }
  
  async function insertFinishGoodsDeliverInfoDB(finishGoodsDeliveryInfo) {
    try {
      return await FinishGoodsDeliveryInfoModel.insertMany(finishGoodsDeliveryInfo);
    } catch (error) {
      throw new Error("Error inserting items unit: " + error.message);
    }
  }

  async function getFinishGoodsDeliverInfoByIdDB(id) {
    try {
      const singleDataInfo = await DeliveryOrderInfoModal.findById(id);
      return singleDataInfo;
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error from service");
    }
  }

  async function updateFinishGoodsReturnStatusDB(data) {
    try {
      const documentId = new mongoose.Types.ObjectId(data._id);
  
      for (let item of data.detailsData) {
        const nestedItemId = new mongoose.Types.ObjectId(item._id);
  
        const newReturnStatus = !item.returnStatus;
        const updatedStatusData = await DeliveryOrderInfoModal.updateOne(
          { _id: documentId, "detailsData._id": nestedItemId },
          { $set: { "detailsData.$.returnStatus": newReturnStatus } },
        );
  
        if (updatedStatusData.matchedCount === 0) {
          console.log(
            `No document found with _id: ${documentId} and detailsData._id: ${nestedItemId}`
          );
        } else {
          console.log(
            "Successfully updated returnStatus for detailsData._id:",
            nestedItemId
          );
        }
      }
    } catch (error) {
      console.error("Error updating return status:", error);
      throw new Error("Failed to update return status for detailsData");
    }
  }
 
module.exports = {
    getFinishGoodsDeliverInfoDB,
    getFilteredFinishGoodsDeliverInfoDB,
    insertFinishGoodsDeliverInfoDB,
    getFinishGoodsDeliverInfoByIdDB,
    updateFinishGoodsReturnStatusDB
  };