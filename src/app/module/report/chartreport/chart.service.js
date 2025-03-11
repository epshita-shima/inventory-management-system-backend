const SalesManagementModel = require("../../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const OrderManagementModel = require("../../salesmanagement/salesmanagementinfo.model");
const PurchaseManagementModel = require("../../goodsreceivenoteinformation/grninfo.model");
const ProductionModel = require("../../productioninformation/productioninfo.model");

async function getSalesTotalDB() {
  try {
    const salesData = await SalesManagementModel.find();
    const purchaseData = await PurchaseManagementModel.find();
    const productionData = await ProductionModel.find();

    const uniqueItemIds = [
      ...new Set(
        salesData.flatMap((item) => item.detailsData.map((d) => d.itemId))
      ),
    ];
    const unitPrices = await OrderManagementModel.find(
      {
        _id: { $in: salesData.map((d) => d.piId) },
        "detailsData.itemId": { $in: uniqueItemIds },
      },
      { _id: 1, detailsData: 1 }
    ).lean();

    const unitPriceMap = unitPrices.reduce((acc, doc) => {
      doc.detailsData.forEach((detail) => {
        acc[`${doc._id}-${detail.itemId}`] = detail.unitPrice || 0;
      });
      return acc;
    }, {});
    const salesGroupedData = {};
    const purchaseGroupedData = {};
    const productionGroupedData = {};
    salesData.forEach((item) => {
      item.detailsData.forEach((detail) => {
        const deliverQty = parseInt(detail.deliverQty, 10);
        if (isNaN(deliverQty)) return;
        const unitPrice = unitPriceMap[`${item.piId}-${detail.itemId}`] || 0;
        const dateKey = new Date(item.finishGoodsDeliveryDate)
          .toISOString()
          .split("T")[0];
        let key;
        key = `${dateKey}-${detail.itemId}`;
        if (!salesGroupedData[key]) {
          salesGroupedData[key] = {
            deliverDate: dateKey,
            itemId: detail.itemId,
            clientId: item.clientId,
            piId: item.piId,
            totalDeliverQty: 0,
            totalDeliverAmount: 0,
            unitPrice: unitPrice,
          };
          salesGroupedData[key].totalDeliverQty += deliverQty;
          salesGroupedData[key].totalDeliverAmount += deliverQty * unitPrice;
        }
      });
    });

    purchaseData.forEach((item) => {
      item.detailsData.forEach((detail) => {
        const purchaseQty = parseInt(detail.quantity, 10);
        if (isNaN(purchaseQty)) return;
        const purchaseAmount = parseInt(detail.amount, 10);
        if (isNaN(purchaseAmount)) return;

        const dateKey = new Date(item.receiveDate).toISOString().split("T")[0];
        let purchaseKey;

        if (!purchaseGroupedData[purchaseKey]) {
          purchaseGroupedData[purchaseKey] = {
            receiveDate: dateKey,
            itemId: detail.itemId,
            supplierId: item.supplierId,
            poId: item.pOSingleId,
            totalPurchaseQty: 0,
            totalPurchaseAmount: 0,
            unitPrice: detail.unitPrice,
          };
        }

        purchaseGroupedData[purchaseKey].totalPurchaseQty += purchaseQty;
        purchaseGroupedData[purchaseKey].totalPurchaseAmount += purchaseAmount;
      });
    });
    productionData.forEach((item) => {
      item.detailsData.forEach((detail) => {
        const materialUsed = parseInt(detail.materialUsed, 10);
        if (isNaN(materialUsed)) return;

        const daterawConsumtionKey = new Date(item.productionDate)
          .toISOString()
          .split("T")[0];
        let rawConsumptionKey;

        if (detail.itemId) {
          rawConsumptionKey = `${daterawConsumtionKey}-${detail.itemId}`;
        }

        if (!productionGroupedData[rawConsumptionKey]) {
          productionGroupedData[rawConsumptionKey] = {
            date: daterawConsumtionKey,
            itemId: detail.itemId,
            totalMaterialUsed: 0,
            totalProductionQty: 0,
          };
        }
        productionGroupedData[rawConsumptionKey].totalProductionQty +=
          item.productionQty;
        productionGroupedData[rawConsumptionKey].totalMaterialUsed +=
          materialUsed;
      });
    });

    const salesTotalInfo = Object.values(salesGroupedData);
    const purchaseTotalInfo = Object.values(purchaseGroupedData);
    const productionInfo = Object.values(productionGroupedData);
    const grandTotalSalesQuantity = salesTotalInfo.reduce(
      (totalQty, details) => {
        return totalQty + details.totalDeliverQty;
      },
      0
    );
    const grandTotalSalesAmount = salesTotalInfo.reduce(
      (totalAmount, details) => {
        return totalAmount + details.totalDeliverAmount;
      },
      0
    );
    const grandTotalPurchaseQty = purchaseTotalInfo.reduce(
      (totalQty, details) => {
        return totalQty + details.totalPurchaseQty;
      },
      0
    );
    const grandTotalPurchaseAmount = purchaseTotalInfo.reduce(
      (totalAmount, details) => {
        return totalAmount + details.totalPurchaseAmount;
      },
      0
    );
    const grandTotalRawConsumptionQty = productionInfo.reduce(
      (totalQty, details) => {
        return totalQty + details.totalMaterialUsed;
      },
      0
    );
    const grandTotalProductionItemQty = productionInfo.reduce(
      (totalQty, details) => {
        return totalQty + details.totalProductionQty;
      },
      0
    );

    return {
      grandTotalSalesQuantity: grandTotalSalesQuantity,
      grandTotalSalesAmount: grandTotalSalesAmount,
      grandTotalPurchaseQty: grandTotalPurchaseQty,
      grandTotalPurchaseAmount: grandTotalPurchaseAmount,
      grandTotalRawConsumptionQty: grandTotalRawConsumptionQty,
      grandTotalProductionItemQty: grandTotalProductionItemQty,
    };
  } catch (error) {
    console.error("Error fetching supplier:", error);
  }
}

module.exports = { getSalesTotalDB };
