const PaymentInfoModel=require('./paymentinfo.model')


async function getIPaymentInfoDB(){
    try {
        const paymentInfo= await PaymentInfoModel.find();
        return paymentInfo;
      } catch (error) {
        console.log("Error fetching item size:", error);
      }
}
async function insertPaymentInfoDB(paymentData) {
    try {
      return await PaymentInfoModel.insertMany(paymentData);
    } catch (error) {
      throw new Error("Error inserting payment info Data: " + error.message);
    }
}
const deletePaymentInfoDB = async (id) => {
  try {
    const deleteProductionInfoData = await PaymentInfoModel.findByIdAndDelete(id);

    if (!deleteProductionInfoData) {
      throw new Error("PO info not found");
    }
    return deleteProductionInfoData;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

module.exports={getIPaymentInfoDB,insertPaymentInfoDB,deletePaymentInfoDB}