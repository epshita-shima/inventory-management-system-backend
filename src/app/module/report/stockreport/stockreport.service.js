const PurchaseModel = require("../../purchaseorderinformation/purchaseorderinfo.model");
const ProductionModel = require("../../productioninformation/productioninfo.model");
const RawMaterialModel = require("../../rawmaterialinformation/rawmaterialinfo.model");
const DeliveredModal = require("../../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const ReturnDataModel = require("../../deliveredreturninformation/deliveredreturninformation.model");
const FinishGoodsModel = require("../../finishgoodsinformation/finishgoods.model");
const mongoose = require("mongoose");

async function getRawMaterialStockReportDB(fromDate, toDate) {
  try {
    const purchaseFilter = {};
    const productionFilter = {};
    if (fromDate) {
      purchaseFilter.receiveDate = fromDate;
      productionFilter.productionDate = fromDate;
    }
    if (toDate) {
      purchaseFilter.receiveDate = toDate;
      productionFilter.productionDate = toDate;
    }
    if (fromDate && toDate) {
      purchaseFilter.receiveDate = {
        $gte: fromDate,
        $lte: toDate,
      };

      productionFilter.productionDate = {
        $gte: fromDate,
        $lte: toDate,
      };
    }
    const purchaseInfo = await PurchaseModel.find().lean();
    const productionInfo = await ProductionModel.find().lean();
    // const rawMaterialData = await RawMaterialModel.find().lean();

    const groupedPurchaseData = purchaseInfo
      .flatMap((purchase) => purchase.detailsData)
      .reduce((acc, detail) => {
        const itemId = detail.itemId;
        const quantity = parseInt(detail.quantity, 10) || 0;
        const unitPrice = parseInt(detail.unitPrice, 10) || 0;
        if (!acc[itemId]) {
          acc[itemId] = { itemId, purchaseQuantity: 0, purchasePrice: 0 };
        }
        acc[itemId].purchaseQuantity += quantity;
        acc[itemId].purchasePrice += unitPrice;

        return acc;
      }, {});

    const groupeProductiondData = productionInfo
      .flatMap((purchase) => purchase.detailsData)
      .reduce((acc, detail) => {
        const itemId = detail.itemId;
        const materialUsed = parseInt(detail.materialUsed, 10) || 0;

        if (!acc[itemId]) {
          acc[itemId] = { itemId, productionConsumption: 0 };
        }
        acc[itemId].productionConsumption += materialUsed;

        return acc;
      }, {});

    const resultPurchase = Object.values(groupedPurchaseData);
    const resultProduction = Object.values(groupeProductiondData);
    const productionMap = resultProduction.reduce((sum, item) => {
      sum[item.itemId] = item.productionConsumption || 0;
      return sum;
    }, {});

    const rawMaterialStockReport = resultPurchase.map((purchase) => {
      const productionConsumption = productionMap[purchase.itemId] || 0;
      return {
        itemId: purchase.itemId,
        purchaseQuantity: purchase.purchaseQuantity,
        productionConsumption: productionConsumption,
        purchasePrice: purchase.purchasePrice,
        stockInHand: purchase.purchaseQuantity - productionConsumption,
      };
    });

    return rawMaterialStockReport;
  } catch (error) {
    console.error("Error in getFilteredForCombineReport:", error);
    throw error;
  }
}

async function getFinishGoodsStockReportDB(fromDate, toDate) {
  console.log(fromDate, toDate);
  try {
    const deliveredFilter = {};
    const returnFilter = {};
    const productionFilter = {};
    if (fromDate) {
      deliveredFilter.finishGoodsDeliveryDate = fromDate;
      returnFilter.returnDate = fromDate;
      productionFilter.productionDate = fromDate;
    }
    if (toDate) {
      deliveredFilter.finishGoodsDeliveryDate = toDate;
      returnFilter.returnDate = toDate;
      productionFilter.productionDate = toDate;
    }
    if (fromDate && toDate) {
      deliveredFilter.finishGoodsDeliveryDate = {
        $gte: fromDate,
        $lte: toDate,
      };
      returnFilter.returnDate = {
        $gte: fromDate,
        $lte: toDate,
      };

      productionFilter.productionDate = {
        $gte: fromDate,
        $lte: toDate,
      };
    }
    const deliveredInfo = await DeliveredModal.find(deliveredFilter).lean();
    const productionInfo = await ProductionModel.find(productionFilter).lean();
    const returnDataInfo = await ReturnDataModel.find(returnFilter).lean();
    const finishGoodsInfo = await FinishGoodsModel.find().lean();
    if(deliveredInfo.length > 0 || productionInfo.length > 0  || returnDataInfo.length > 0 ){
      const stockData = finishGoodsInfo.map((item) => {
        const itemId = item._id;
  
        const productionQty = productionInfo
          .filter((prod) => prod.productionItemName == itemId)
          .reduce((sum, prod) => sum + (prod.productionQty || 0), 0);
  
        const deliveredQty = deliveredInfo
          .flatMap((del) => del.detailsData)
          .filter((detail) =>
            new mongoose.Types.ObjectId(detail.itemId).equals(itemId)
          )
          .reduce((sum, detail) => sum + (parseFloat(detail.deliverQty) || 0), 0);
  
        const returnQty = returnDataInfo
          .flatMap((ret) => ret.detailsData)
          .filter((detail) =>
            new mongoose.Types.ObjectId(detail.itemId).equals(itemId)
          )
          .reduce((sum, detail) => sum + (parseFloat(detail.returnQty) || 0), 0);
  
        const stockInHand = productionQty !==0 ? productionQty- (deliveredQty + returnQty) : (deliveredQty + returnQty);
  
        return { itemId, productionQty, deliveredQty, returnQty, stockInHand };
      });
      return stockData;
    }
 
  } catch (error) {
    console.error("Error in getFilteredForCombineReport:", error);
    throw error;
  }
}

module.exports = {
  getRawMaterialStockReportDB,
  getFinishGoodsStockReportDB,
};
