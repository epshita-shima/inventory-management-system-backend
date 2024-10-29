const RetunDeliveredInfoModel = require("./deliveredreturninformation.model");
const SalesManagementModel = require("../salesmanagement/salesmanagementinfo.model");
const FinishGoodsDeliveryInfoModel = require("../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const mongoose = require("mongoose");

async function getRetunDeliveredInfoDB() {
  try {
    const deliveryReturnData = await RetunDeliveredInfoModel.find();
    return deliveryReturnData;
  } catch (error) {
    console.error("Error fetching delivery Return data:", error);
  }
}

async function insertReturnDeliveredInfoDB(returnInfo) {
  try {
    // Fetch the detailsData arrays from both collections
    const existingInvoice = await SalesManagementModel.findOne(
      { _id: new mongoose.Types.ObjectId(returnInfo.piId) },
    );
    const existingFinishGoodsDelivery =
      await FinishGoodsDeliveryInfoModel.findOne(
        { _id: new mongoose.Types.ObjectId(returnInfo.deliveredId) },
      );

    // Proceed if at least one of the documents has matching detailsData
    if (
      (existingInvoice && existingInvoice.detailsData.length > 0) ||
      (existingFinishGoodsDelivery && existingFinishGoodsDelivery.detailsData.length > 0)
    ) {
      // Helper function to update returnQty for the matched details
      const updateInvoiceReturnQty = async (model, piId, itemId, newReturnQty) => {
        await model.updateOne(
          {
            _id: new mongoose.Types.ObjectId(piId),
            "detailsData.itemId": itemId,
          },
          {
            $set: {
              "detailsData.$.returnQty": newReturnQty,
            },
          }
        );
      };
      const updateFGReturnQty = async (model, deliveredId, itemId, newReturnQty) => {
        await model.updateOne(
          {
            _id: new mongoose.Types.ObjectId(deliveredId),
            "detailsData.itemId": itemId,
          },
          {
            $set: {
              "detailsData.$.returnStatus":true,
              "detailsData.$.returnQty": newReturnQty,
            },
          }
        );
      };

      if (existingInvoice && existingInvoice.detailsData.length > 0) {
        for (const newInvoiceDetail of returnInfo.detailsData) {
          const existingDetail = existingInvoice.detailsData.find(
            (detail) => detail.itemId === newInvoiceDetail.itemId
          );
          if (existingDetail) {
            const existingReturnQty = existingDetail.returnQty || 0;
            const newReturnQty =
              parseFloat(existingReturnQty) + parseFloat(newInvoiceDetail.returnQty);
            await updateInvoiceReturnQty(SalesManagementModel, returnInfo.piId, newInvoiceDetail.itemId, newReturnQty);
          }
        }
      }

      if (existingFinishGoodsDelivery && existingFinishGoodsDelivery.detailsData.length > 0) {
        for (const newFGDeliveryDetail of returnInfo.detailsData) {
          const existingFGDetail = existingFinishGoodsDelivery.detailsData.find(
            (detail) => detail.itemId === newFGDeliveryDetail.itemId
          );
          if (existingFGDetail) {
            const existingFGReturnQty = existingFGDetail.returnQty || 0;
            const newFGReturnQty =
              parseFloat(existingFGReturnQty) + parseFloat(newFGDeliveryDetail.returnQty);
            await updateFGReturnQty(FinishGoodsDeliveryInfoModel, returnInfo.deliveredId, newFGDeliveryDetail.itemId, newFGReturnQty);
          }
        }
      }

      const insertReturnInfo = await RetunDeliveredInfoModel.insertMany(returnInfo);
      console.log(`Successfully updated document with _id: ${returnInfo.piId}`);
      return { success: true, insertReturnInfo };

    } else {
      console.log(`No details found for _id: ${returnInfo.piId}`);
      return { success: false, message: 'No details found for the provided piId or doId' };
    }
  } catch (error) {
    console.error("Error inserting delivery Return Data:", error);
    throw new Error("Error inserting delivery return data: " + error.message);
  }
}


async function getReturnDeliveredDataInfoByIdDB(id) {
  try {
    const singleReturnDeliveredInfo = await RetunDeliveredInfoModel.findById(
      id
    );
    return singleReturnDeliveredInfo;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error from service");
  }
}
const deleteReturnDeliveredInfoDB = async (id) => {
  console.log(id);
  try {

    const existingReturnInfo = await RetunDeliveredInfoModel.findOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );
    console.log("existingReturnInfo",existingReturnInfo)
    const existingInvoice = await SalesManagementModel.findOne(
      { _id: new mongoose.Types.ObjectId(existingReturnInfo.piId) },
    );
    const existingFinishGoodsDelivery =
      await FinishGoodsDeliveryInfoModel.findOne(
        { _id: new mongoose.Types.ObjectId(existingReturnInfo.deliveredId) },
      );

      if (
        (existingInvoice && existingInvoice.detailsData.length > 0) ||
        (existingFinishGoodsDelivery && existingFinishGoodsDelivery.detailsData.length > 0)
      ) {
        // Helper function to update returnQty for the matched details
        const updateInvoiceReturnQty = async (model, piId, itemId, newReturnQty) => {
          await model.updateOne(
            {
              _id: new mongoose.Types.ObjectId(piId),
              "detailsData.itemId": itemId,
            },
            {
              $set: {
                "detailsData.$.returnQty": newReturnQty,
              },
            }
          );
        };
        const updateFGReturnQty = async (model, deliveredId, itemId, newReturnQty) => {
          await model.updateOne(
            {
              _id: new mongoose.Types.ObjectId(deliveredId),
              "detailsData.itemId": itemId,
            },
            {
              $set: {
                "detailsData.$.returnStatus":false,
                "detailsData.$.returnQty": newReturnQty,
              },
            }
          );
        };
  
        // Update the returnQty in SalesManagementModel
        if (existingInvoice && existingInvoice.detailsData.length > 0) {
          for (const newInvoiceDetail of existingReturnInfo.detailsData) {
            const existingDetail = existingInvoice.detailsData.find(
              (detail) => detail.itemId === newInvoiceDetail.itemId
            );
            if (existingDetail) {
              const existingReturnQty = existingDetail.returnQty || 0;
              const newReturnQty =
                parseFloat(existingReturnQty) - parseFloat(newInvoiceDetail.returnQty);
              await updateInvoiceReturnQty(SalesManagementModel, existingReturnInfo.piId, newInvoiceDetail.itemId, newReturnQty);
            }
          }
        }
  
        // Update the returnQty in FinishGoodsDeliveryInfoModel
        if (existingFinishGoodsDelivery && existingFinishGoodsDelivery.detailsData.length > 0) {
          for (const newFGDeliveryDetail of existingReturnInfo.detailsData) {
            const existingFGDetail = existingFinishGoodsDelivery.detailsData.find(
              (detail) => detail.itemId === newFGDeliveryDetail.itemId
            );
            if (existingFGDetail) {
              const existingFGReturnQty = existingFGDetail.returnQty || 0;
              const newFGReturnQty =
                parseFloat(existingFGReturnQty) - parseFloat(newFGDeliveryDetail.returnQty);
              await updateFGReturnQty(FinishGoodsDeliveryInfoModel, existingReturnInfo.deliveredId, newFGDeliveryDetail.itemId, newFGReturnQty);
            }
          }
        }
        const deleteReturnDeliverInfoData =
        await RetunDeliveredInfoModel.findByIdAndDelete(id);
      console.log("deleteReturnDeliverInfoData", deleteReturnDeliverInfoData);
      if (!deleteReturnDeliverInfoData) {
        throw new Error("DO info not found");
      }
      return { status: 200, data: deleteReturnDeliverInfoData };
    }
    
  } catch (error) {
    console.error("Error deleting return delivered info:", error);
    throw new Error("Internal server error");
  }
};

module.exports = {
  getRetunDeliveredInfoDB,
  insertReturnDeliveredInfoDB,
  getReturnDeliveredDataInfoByIdDB,
  deleteReturnDeliveredInfoDB,
};
