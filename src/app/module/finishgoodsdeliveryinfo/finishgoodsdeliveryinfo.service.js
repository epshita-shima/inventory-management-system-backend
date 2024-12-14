const FinishGoodsDeliveryInfoModel = require("./finishgoodsdeliveryinfo.model");
const DeliveryOrderInfoModal = require("../deliveryorderinformation/deliveryorderinfo.module");
const SalesManagementModel = require("../salesmanagement/salesmanagementinfo.model");

const mongoose = require("mongoose");
const { errorlogger, logger } = require("../../../shared/logger");

async function getFinishGoodsDeliverInfoDB() {
  try {
    const deliveryData = await FinishGoodsDeliveryInfoModel.find();
    return deliveryData;
  } catch (error) {
    errorlogger.error("Error fetching production data:", error);
  }
}

async function getFilteredFinishGoodsDeliverInfoDB(clientId, approveStatus) {
  try {
    const filter = {};
    if (clientId) {
      filter.clientId = clientId;
    }

    if (approveStatus) {
      filter.approveStatus = approveStatus;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await DeliveryOrderInfoModal.find(filter);
    return data;
  } catch (error) {
    errorlogger.error(error);
    throw new Error("Error fetching payment method info");
  }
}

async function insertFinishGoodsDeliverInfoDB(finishGoodsDeliveryInfo) {
  try {
    const existingDO = await DeliveryOrderInfoModal.findOne({
      _id: new mongoose.Types.ObjectId(finishGoodsDeliveryInfo.doId),
    });
    const existingInvoice = await SalesManagementModel.findOne({
      _id: new mongoose.Types.ObjectId(finishGoodsDeliveryInfo.piId),
    });
    if (
      existingDO ||
      (existingInvoice && existingInvoice.detailsData.length > 0)
    ) {
      const updateInvoiceReturnQty = async (
        model,
        piId,
        itemId,
        newReturnQty
      ) => {
        await model.updateOne(
          {
            _id: new mongoose.Types.ObjectId(piId),
            "detailsData.itemId": itemId,
          },
          {
            $set: {
              "detailsData.$.deliveredQty": newReturnQty,
            },
          }
        );
      };
      const updateDOStatus = async (model, doId) => {
        await model.findByIdAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(doId),
          },
          {
            $set: {
              deliveryStatus: true,
            },
          }
        );
      };
      if (existingDO) {
        await updateDOStatus(
          DeliveryOrderInfoModal,
          finishGoodsDeliveryInfo.doId
        );
      }
      if (existingInvoice && existingInvoice.detailsData.length > 0) {
        for (const newInvoiceDetail of finishGoodsDeliveryInfo.detailsData) {
          const existingDetail = existingInvoice.detailsData.find(
            (detail) => detail.itemId === newInvoiceDetail.itemId
          );
          if (existingDetail) {
            const existingDeliverQty = existingDetail.deliveredQty || 0;
            const newReturnQty =
              parseFloat(existingDeliverQty) +
              parseFloat(newInvoiceDetail.deliverQty);
            await updateInvoiceReturnQty(
              SalesManagementModel,
              finishGoodsDeliveryInfo.piId,
              newInvoiceDetail.itemId,
              newReturnQty
            );
          }
        }
      }
      const insertFGDelivery = await FinishGoodsDeliveryInfoModel.insertMany(
        finishGoodsDeliveryInfo
      );
  
      return { success: true, insertFGDelivery };
    } else {
      logger.info(`No details found for _id: ${finishGoodsDeliveryInfo.doId}`);
      return {
        success: false,
        message: "No details found for the provided piId or doId",
      };
    }
  } catch (error) {
    throw new Error("Error inserting items unit: " + error.message);
  }
}

async function getFinishGoodsDeliverInfoByIdDB(id) {
  try {
    const singleDataInfo = await DeliveryOrderInfoModal.findById(id);
    return singleDataInfo;
  } catch (error) {
    errorlogger.error(error);
    throw new Error("Internal server error from service");
  }
}

module.exports = {
  getFinishGoodsDeliverInfoDB,
  getFilteredFinishGoodsDeliverInfoDB,
  insertFinishGoodsDeliverInfoDB,
  getFinishGoodsDeliverInfoByIdDB,
};
