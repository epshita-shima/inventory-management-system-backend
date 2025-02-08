const PurchaseModel = require("../../purchaseorderinformation/purchaseorderinfo.model");
const ProductionModel = require("../../productioninformation/productioninfo.model");
const RawMaterialModel = require("../../rawmaterialinformation/rawmaterialinfo.model");
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
    const rawMaterialData = await RawMaterialModel.find().lean();

    const groupedPurchaseData = purchaseInfo
      .flatMap((purchase) => purchase.detailsData)
      .reduce((acc, detail) => {
        const itemId = detail.itemId;
        const quantity = parseInt(detail.quantity, 10) || 0;
        const unitPrice = parseInt(detail.unitPrice, 10) || 0;
        if (!acc[itemId]) {
          acc[itemId] = { itemId, purchaseQuantity: 0,purchasePrice:0 };
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
      const purchaseConsumption = productionMap[purchase.itemId] || 0;
      return {
        itemId: purchase.itemId,
        purchaseQuantity: purchase.purchaseQuantity,
        purchaseConsumption: purchaseConsumption,
        purchasePrice:purchase.purchasePrice,
        stockInHand: purchase.purchaseQuantity - purchaseConsumption,
      };
    });
    console.log("rawMaterialStockReport", rawMaterialStockReport);
    return rawMaterialStockReport;
  } catch (error) {
    console.error("Error in getFilteredForCombineReport:", error);
    throw error;
  }
}
module.exports = {
  getRawMaterialStockReportDB,
};
