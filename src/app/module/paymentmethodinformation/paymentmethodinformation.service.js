const { errorlogger } = require("../../../shared/logger");
const PaymentReceiveInfoModel = require("./paymentmethodinformation.model");

async function getPaymentMethodInfoDB() {
  try {
    const productionData = await PaymentReceiveInfoModel.find();
    return productionData;
  } catch (error) {
    console.log("Error fetching production data:", error);
  }
}

async function getFilteredPaymentMethodInfoDB(clientId, piNumber) {
  try {
    const filter = {};
    if (clientId) {
      filter.clientId = clientId;
    }

    if (piNumber) {
      filter.piNumber = piNumber;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await PaymentReceiveInfoModel.find(filter);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

async function insertPaymentMethodInfoDB(paymnetMethodInfo) {
  try {
    return await PaymentReceiveInfoModel.insertMany(paymnetMethodInfo);
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

async function getPaymentMethodInfoByIdDB(id) {
  try {
    const singlePaymentMethodInfo = await PaymentReceiveInfoModel.findById(id);
    return singlePaymentMethodInfo;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error from service");
  }
}

async function updatePreviousPaymentMethodInfoDB(data) {
  try {
    for (const detail of data) {
      if(detail.isRemoveStatus==true ){
        if(detail.isParent==true){
           await PaymentReceiveInfoModel.findByIdAndDelete(
            detail.parentId
          );
        }
        else{
          await PaymentReceiveInfoModel.updateOne(
            { "detailsData._id": detail._id },
            { $pull: { detailsData: { _id: detail._id } } }
          );
        }
      }
      else{
        await PaymentReceiveInfoModel.updateOne(
          { "detailsData._id": detail._id }, 
          { $set: { "detailsData.$": detail }} 
        );
      }
     
    }
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error from service");
  }
}

const deletePaymentMethodInfoDB = async (data) => {
  try {
    for (const detail of data) {
      const deletedPaymentData = await PaymentReceiveInfoModel.findByIdAndDelete(
        detail._id
      );
      if (deletedPaymentData == null) {
        const deletedPaymnetDetailsData =
          await PaymentReceiveInfoModel.updateOne(
            { "detailsData._id": detail._id },
            { $pull: { detailsData: { _id: detail._id } } }
          );
        return deletedPaymnetDetailsData;
      } else {
        return deletedPaymentData;
      }
    }
  } catch (error) {
    throw new Error("Internal server error");
  }
};

const deletePreviousPaymentMethodInfoDB = async (id) => {
  try {
    const deletedPaymentData = await PaymentReceiveInfoModel.findByIdAndDelete(
      id
    );
    if (deletedPaymentData == null) {
      const deletedPaymnetDetailsData = await PaymentReceiveInfoModel.updateOne(
        { "detailsData._id": id },
        { $pull: { detailsData: { _id: id } } }
      );
      return deletedPaymnetDetailsData;
    } else {
      return deletedPaymentData;
    }
  } catch (error) {
    throw new Error("Internal server error");
  }
};

module.exports = {
  getPaymentMethodInfoDB,
  getFilteredPaymentMethodInfoDB,
  insertPaymentMethodInfoDB,
  getPaymentMethodInfoByIdDB,
  updatePreviousPaymentMethodInfoDB,
  deletePaymentMethodInfoDB,
};
