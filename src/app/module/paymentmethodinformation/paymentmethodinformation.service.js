const PaymentMethodInfoModel = require("./paymentmethodinformation.model");

async function getPaymentMethodInfoDB() {
  try {
    const productionData = await PaymentMethodInfoModel.find();
    return productionData;
  } catch (error) {
    console.error("Error fetching production data:", error);
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

async function updatePaymentMethodInfoDB(id, data) {
  try {
    const updatePaymentMethodInfo = await PaymentMethodInfoModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updatePaymentMethodInfo) {
      console.log("No matching document found for ID:", id);
      return null;
    }

    if (updatePaymentMethodInfo) {
      return updatePaymentMethodInfo;
    } else {
      console.log("No matching document found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}

const deletePaymentMethodInfoDB = async (id) => {
    try {
      const deletePaymentMethodInfoData = await PaymentMethodInfoModel.findByIdAndDelete(id);
      console.log(deletePaymentMethodInfoData, "delete");
      if (!deletePaymentMethodInfoData) {
        throw new Error("PO info not found");
      }
      return deletePaymentMethodInfoData;
    } catch (error) {
      throw new Error("Internal server error");
    }
  };

module.exports = {
  getPaymentMethodInfoDB,
  insertPaymentMethodInfoDB,
  getPaymentMethodInfoByIdDB,
  updatePaymentMethodInfoDB,
  deletePaymentMethodInfoDB
};