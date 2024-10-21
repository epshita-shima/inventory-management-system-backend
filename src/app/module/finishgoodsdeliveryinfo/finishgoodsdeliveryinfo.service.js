
const FinishGoodsDeliveryInfoModel = require("./finishgoodsdeliveryinfo.model");
async function getFinishGoodsDeliverInfoDB() {
    try {
      const deliveryData = await FinishGoodsDeliveryInfoModel.find({ deliveryStatus: false });
      return deliveryData;
    } catch (error) {
      console.error("Error fetching production data:", error);
    }
  }
  
  async function getFilteredFinishGoodsDeliverInfoInfoDB(clientId,approveStatus) {
    try {
        const filter = {};
        if (clientId) {
          filter.clientId = clientId;
        }
    
        if (approveStatus !== undefined && approveStatus !== null) {
            // If approveStatus is string 'true' or 'false', convert to boolean
            if (approveStatus === 'true') {
                console.log('true')
              filter.approveStatus = true;
            } else if (approveStatus === 'false') {
                console.log('false')
              filter.approveStatus = false;
            } else {
              // If already a boolean, just use it
              filter.approveStatus = approveStatus;
            }
          }
      
          // Log the filter for debugging
          console.log('filter', filter);
      
        if (Object.keys(filter).length === 0) {
          return [];
        }
        console.log('filter.approveStatus type:', typeof filter.approveStatus);
    
        const data = await FinishGoodsDeliveryInfoModel.find(filter);
        console.log('data',data)
        return data;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching payment method info");
      }
  }

  
module.exports = {
    getFinishGoodsDeliverInfoDB,
    getFilteredFinishGoodsDeliverInfoInfoDB
  };