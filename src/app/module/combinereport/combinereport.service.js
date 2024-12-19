const GRNSModel = require("../goodsreceivenoteinformation/grninfo.model");
const OrderModel = require("../salesmanagement/salesmanagementinfo.model");
const ProductionModel = require("../productioninformation/productioninfo.model");
const SalesModel = require("../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const ReturnModel = require("../deliveredreturninformation/deliveredreturninformation.model");
const RawMaterialModel = require("../rawmaterialinformation/rawmaterialinfo.model");
const FinishGoodsModel = require("../finishgoodsinformation/finishgoods.model");
const { errorlogger } = require("../../../shared/logger");
async function getFilteredForManagementCombineReportDB(fromDate, toDate) {
  console.log("combine service", fromDate, toDate); // Fixing the typo
  try {
    const purchasefilter = {};
    const orderFilter = {};
    const salesFilter = {};
    const productionFilter = {};
    const returnFilter = {};
    // Create filter based on the dates provided
    if (fromDate) {
      purchasefilter.receiveDate = fromDate; // Use Date object directly
      orderFilter.piDate = new Date(fromDate);
      salesFilter.finishGoodsDeliveryDate = new Date(fromDate);
      productionFilter.productionDate = fromDate;
      returnFilter.returnDate = new Date(fromDate);
    }

    if (toDate) {
      purchasefilter.receiveDate = toDate;
      orderFilter.piDate = new Date(toDate);
      salesFilter.finishGoodsDeliveryDate = new Date(toDate);
      productionFilter.productionDate = toDate;
      returnFilter.returnDate = new Date(toDate);
    }

    if (fromDate && toDate) {
      purchasefilter.receiveDate = {
        $gte: fromDate,
        $lte: toDate,
      };

      orderFilter.piDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };

      salesFilter.finishGoodsDeliveryDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };

      productionFilter.productionDate = {
        $gte: fromDate,
        $lte: toDate,
      };
      returnFilter.returnDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Fetch the data from the database
    const purchaseData = await GRNSModel.find(purchasefilter).lean();
    const rawMaterialData = await RawMaterialModel.find().lean();
    const orderData = await OrderModel.find(orderFilter).lean();
    const salesData = await SalesModel.find(salesFilter).lean();
    const finishGoodsData = await FinishGoodsModel.find().lean();
    const productionData = await ProductionModel.find(productionFilter).lean();
    const returnData = await ReturnModel.find(returnFilter).lean();

    function groupPurchaseDataAndCalculateTotals() {
      const groupedData = {};
      purchaseData.forEach((record) => {
        const { detailsData } = record;
        detailsData.forEach((detail) => {
          const { itemId } = detail;
          let groupKey;
          groupKey = `${detail.itemId}`;
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
              itemId: itemId,
              totalPurchaseQuantity: 0,
              totalPurchaseAmount: 0,
              purchaseRateinAvg: 0,
            };
          }
          groupedData[groupKey].totalPurchaseQuantity += Number(
            detail.quantity || 0
          );
          groupedData[groupKey].totalPurchaseAmount += Number(
            detail.amount || 0
          );
          groupedData[groupKey].purchaseRateinAvg = Number(
            detail.amount / detail.quantity
          );
        });
      });

      return Object.values(groupedData).map((group) => {
        // Find the itemName from rawMaterialData
        const itemName =
          rawMaterialData.find(
            (rawMaterial) => rawMaterial._id.toString() === group.itemId
          )?.itemName || "N/A";

        return {
          ...group,
          itemName,
        };
      });
    }

    const groupedPurchaseResult = groupPurchaseDataAndCalculateTotals().sort(
      (a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        return nameA.localeCompare(nameB);
      }
    );

    const uniqueItemIds = [
      ...new Set(
        salesData.flatMap((item) => item.detailsData.map((d) => d.itemId))
      ),
    ];

    const unitPrices = await OrderModel.find(
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

    function groupSalesDataAndCalculateTotals() {
      const groupedData = {};
      salesData.forEach((record) => {
        const { detailsData,clientId,piId } = record;
        detailsData.forEach((detail) => {
          const { itemId } = detail;
          let groupKey;
          groupKey = `${detail.itemId}`;
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
              itemId: itemId,
              clientId:clientId,
              piId:piId,
              totalSalesQuantity: 0,
              totalSalesAmount: 0,
              salesRateinAvg: 0,
            };
          }
          const salesQuantity = Number(detail.deliverQty);
          if (salesQuantity > 0) {
            // Update total sales quantity
            groupedData[groupKey].totalSalesQuantity += salesQuantity;
            const unitPrice =
              unitPriceMap[`${record.piId}-${detail.itemId}`] || 0;
            groupedData[groupKey].totalSalesAmount += salesQuantity * unitPrice;

            // Update the average sales rate (handle division by zero)
            if (groupedData[groupKey].totalSalesQuantity > 0) {
              groupedData[groupKey].salesRateinAvg =
                groupedData[groupKey].totalSalesAmount /
                groupedData[groupKey].totalSalesQuantity;
            }
          }
        });
      });

      return Object.values(groupedData).map((group) => {
        // Find the itemName from rawMaterialData
        const itemName =
          finishGoodsData.find(
            (finishGoods) => finishGoods._id.toString() === group.itemId
          )?.itemName || "N/A";

        return {
          ...group,
          itemName,
        };
      });
    }

    const groupedSalesResult = groupSalesDataAndCalculateTotals().sort(
      (a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        return nameA.localeCompare(nameB);
      }
    );

    function groupOrderDataAndCalculateTotals() {
      const groupedData = {};
      orderData.forEach((record) => {
        const { detailsData } = record;
        detailsData.forEach((detail) => {
          const { itemId } = detail;

          let groupKey;
          groupKey = `${detail.itemId}`;
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
              itemId: itemId,
              totalPiQuantity: 0,
              totalPiAmount: 0,
              piRateinAvg: 0,
            };
          }

          // Update total sales quantity
          groupedData[groupKey].totalPiQuantity += detail.quantity;
          groupedData[groupKey].totalPiAmount += detail.totalAmount;
          groupedData[groupKey].piRateinAvg =
            detail.totalAmount / detail.quantity;

          // Update the average sales rate (handle division by zero)
        });
      });

      return Object.values(groupedData).map((group) => {
        // Find the itemName from rawMaterialData
        const itemName =
          finishGoodsData.find(
            (finishGoods) => finishGoods._id.toString() === group.itemId
          )?.itemName || "N/A";

        return {
          ...group,
          itemName,
        };
      });
    }

    const groupedOrderResult = groupOrderDataAndCalculateTotals().sort(
      (a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        return nameA.localeCompare(nameB);
      }
    );

    function groupProductionDataAndCalculateTotals() {
      const groupedData = {};
      productionData.forEach((record) => {
        const { productionItemName } = record;

        let groupKey;
        groupKey = `${productionItemName}`;
        if (!groupedData[groupKey]) {
          groupedData[groupKey] = {
            itemId: productionItemName,
            totalProductionQty: 0,
          };
        }
        groupedData[groupKey].totalProductionQty += record.productionQty;
      });

      return Object.values(groupedData).map((group) => {
        // Find the itemName from rawMaterialData
        const itemName =
          finishGoodsData.find(
            (finishGoods) => finishGoods._id.toString() === group.itemId
          )?.itemName || "N/A";

        return {
          ...group,
          itemName,
        };
      });
    }

    const groupedProductionResult =
      groupProductionDataAndCalculateTotals().sort((a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        return nameA.localeCompare(nameB);
      });

    function groupReturnDataAndCalculateTotals() {
      const groupedData = {};
      returnData.forEach((record) => {
        const { detailsData } = record;
        detailsData.forEach((detail) => {
          const { itemId } = detail;

          let groupKey;
          groupKey = `${detail.itemId}`;
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
              itemId: itemId,
              totalReturnQuantity: 0,
              totalReturnAmount: 0,
              returnRateinAvg: 0,
            };
          }
          const returnQuantity = Number(detail.returnQty);
          if (returnQuantity > 0) {
            // Update total sales quantity
            groupedData[groupKey].totalReturnQuantity += returnQuantity;
            const unitPrice =
              unitPriceMap[`${record.piId}-${detail.itemId}`] || 0;
            groupedData[groupKey].totalReturnAmount +=
              returnQuantity * unitPrice;

            // Update the average sales rate (handle division by zero)
            if (groupedData[groupKey].totalReturnQuantity > 0) {
              groupedData[groupKey].returnRateinAvg =
                groupedData[groupKey].totalReturnAmount /
                groupedData[groupKey].totalReturnQuantity;
            }
          }
        });
      });

      return Object.values(groupedData).map((group) => {
        // Find the itemName from rawMaterialData
        const itemName =
          finishGoodsData.find(
            (finishGoods) => finishGoods._id.toString() === group.itemId
          )?.itemName || "N/A";

        return {
          ...group,
          itemName,
        };
      });
    }

    const groupedReturnResult = groupReturnDataAndCalculateTotals().sort(
      (a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        return nameA.localeCompare(nameB);
      }
    );

    return {
      groupedPurchaseResult,
      groupedProductionResult,
      groupedSalesResult,
      groupedOrderResult,
      groupedReturnResult,
    };
  } catch (error) {
    errorlogger.error("Error fetching data:", error);
    throw new Error("Error fetching payment method info");
  }
}

module.exports = { getFilteredForManagementCombineReportDB };
