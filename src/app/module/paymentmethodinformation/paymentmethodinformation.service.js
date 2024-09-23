const PaymentMethodInfoModel = require("./paymentmethodinformation.model");

async function getPaymentMethodInfoDB() {
  try {
    const productionData = await PaymentMethodInfoModel.find();
    return productionData;
  } catch (error) {
    console.error("Error fetching production data:", error);
  }
}

async function getFilteredPaymentMethodInfoDB(clientId, piNumber) {
  try {
    const filter = {};

    // Add condition for clientId if provided
    if (clientId) {
      filter.clientId = clientId;
    }

    // Add condition for piNumber if provided
    if (piNumber) {
      filter.piNumber = piNumber;
    }

    // If no filters are provided, return an empty array
    if (Object.keys(filter).length === 0) {
      return [];
    }

    // Query the database with the constructed filter object
    const data = await PaymentMethodInfoModel.find(filter);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}

async function insertPaymentMethodInfoDB(paymnetMethodInfo) {
  console.log(paymnetMethodInfo);
  try {
    return await PaymentMethodInfoModel.insertMany(paymnetMethodInfo);
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

async function getPaymentMethodInfoByIdDB(id) {
  try {
    const singlePaymentMethodInfo = await PaymentMethodInfoModel.findById(id);
    console.log(singlePaymentMethodInfo);
    return singlePaymentMethodInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

async function updatePreviousPaymentMethodInfoDB(data) {
  console.log("data", data);
  try {
    for (const detail of data) {
      if(detail.isRemoveStatus==true ){
        if(detail.isParent==true){
           await PaymentMethodInfoModel.findByIdAndDelete(
            detail.parentId
          );
        }
        else{
          await PaymentMethodInfoModel.updateOne(
            { "detailsData._id": detail._id },
            { $pull: { detailsData: { _id: detail._id } } }
          );
        }
      }
      else{
        await PaymentMethodInfoModel.updateOne(
          { "detailsData._id": detail._id }, 
          { $set: { "detailsData.$": detail }} 
        );
      }
     
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

const deletePaymentMethodInfoDB = async (data) => {
  try {
    console.log("delete data", data);
    for (const detail of data) {
      const deletedPaymentData = await PaymentMethodInfoModel.findByIdAndDelete(
        detail._id
      );
      if (deletedPaymentData == null) {
        const deletedPaymnetDetailsData =
          await PaymentMethodInfoModel.updateOne(
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
    const deletedPaymentData = await PaymentMethodInfoModel.findByIdAndDelete(
      id
    );
    if (deletedPaymentData == null) {
      const deletedPaymnetDetailsData = await PaymentMethodInfoModel.updateOne(
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
