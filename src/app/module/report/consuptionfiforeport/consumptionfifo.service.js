const ConsumptionModel = require("../../rmconsumptiondetailbynetworth/rmconsumptiondetail.model");
const GRNModel = require("../../goodsreceivenoteinformation/grninfo.model");

const getConsumptionDB = async (fromDate, toDate, itemId) => {
  try {
    const consumptionFilter = {};
    const purchaseFilter = {};
    if (fromDate) {
      consumptionFilter.makeDate = new Date(fromDate);
      purchaseFilter.receiveDate = fromDate;
    }
    if (toDate) {
      consumptionFilter.makeDate = new Date(toDate);
      purchaseFilter.makeDate = toDate;
    }
    if (fromDate && toDate) {
      consumptionFilter.makeDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
      purchaseFilter.makeDate = { $gte: fromDate, $lte: toDate };
    }
    if (itemId) {
      consumptionFilter.itemId = itemId;
      purchaseFilter["detailsData.itemId"] = itemId;
    }
    const prevPurchaseDate = await GRNModel.find({
      receiveDate: { $lt: fromDate },
    });
    const prevConsumptionIssue = await ConsumptionModel.find({
      makeDate: { $lt: new Date(fromDate) },
    });

    const consumptionIssue = await ConsumptionModel.find(consumptionFilter);
    const purchaseData = await GRNModel.find(purchaseFilter);

    const prevPurchaseGroup = {};
    prevPurchaseDate.forEach((items) => {
      items.detailsData.forEach((detail) => {
        let key;
        const dateKey = items.receiveDate;
        const itemKey = detail?.itemId;
        if (detail?.itemId) {
          key = `${itemKey}`;
        }

        if (!prevPurchaseGroup[key]) {
          prevPurchaseGroup[key] = {
            date: dateKey,
            itemId: detail?.itemId,
            totalQuantity: 0,
            avgRate: 0,
            totalAmount: 0,
          };
          prevPurchaseGroup[key].totalQuantity += detail?.quantity;
          prevPurchaseGroup[key].totalAmount += detail?.amount;
          prevPurchaseGroup[key].avgRate += prevPurchaseGroup[key]?.totalAmount
            ? prevPurchaseGroup[key]?.totalAmount /
              prevPurchaseGroup[key]?.totalQuantity
            : 0;
        }
      });
    });

    const prevConsumptionIssueGroup = {};

    prevConsumptionIssue.forEach((item) => {
      let key = `${item?.itemId}`;

      if (!prevConsumptionIssueGroup[key]) {
        prevConsumptionIssueGroup[key] = {
          date: new Date(item.makeDate).toLocaleDateString("en-CA"),
          itemId: item?.itemId,
          totalMaterialUsed: 0,
          totalAvgRate: 0,
          totalAmount: 0,
        };
        prevConsumptionIssueGroup[key].totalMaterialUsed += item?.materialUsed;
        prevConsumptionIssueGroup[key].totalAmount += item?.amount;
        prevConsumptionIssueGroup[key].totalAvgRate +=
          prevConsumptionIssueGroup[key]?.totalAmount
            ? prevConsumptionIssueGroup[key]?.totalAmount /
              prevConsumptionIssueGroup[key]?.totalMaterialUsed
            : 0;
      }
    });
    console.log("prevConsumptionIssueGroup", prevConsumptionIssueGroup);
    const prevConsumptionIssueData = Object.values(prevConsumptionIssueGroup);
    const prevPurchaseData = Object.values(prevPurchaseGroup);
    const calculateOpeningBalance = prevPurchaseData.map((purchase, index) => {
      const prevConsumptionIssue = prevConsumptionIssueData.find(
        (issue) => issue?.itemId === purchase?.itemId
      );
      if (!prevConsumptionIssueData) return purchase;

      const updateAmount = purchase?.totalAmount
        ? purchase?.totalAmount - prevConsumptionIssue?.totalAmount
        : 0;
      const updateQuantity =
        purchase.totalQuantity - prevConsumptionIssue?.totalMaterialUsed;
      return {
        date: purchase.date,
        itemId: prevConsumptionIssue?.itemId,
        amount: updateAmount,
        quantity: updateQuantity,
        rate: updateQuantity !== 0 ? updateAmount / updateQuantity : 0,
      };
    });

    console.log("consumptionIssue", consumptionIssue);

    const getDateRange = (fromDate, toDate) => {
      const dates = [];
      let current = new Date(fromDate);

      while (current <= new Date(toDate)) {
        dates.push(new Date(current).toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };
    const processStockData = (
      prevPurchaseData,
      consumptionIssue,
      fromDate,
      toDate
    ) => {
      const dateRange = getDateRange(fromDate, toDate);
      const formattedData = [];

      dateRange.forEach((dateStr, index) => {
    

        // const openingData = calculateOpeningBalance.find(
        //   (item) => item?.itemId === purchase?.itemId
        // );
    
        const openingQty = calculateOpeningBalance[index]?.quantity;
        const openingRate = calculateOpeningBalance[index]?.rate;
        const openingAmount = calculateOpeningBalance[index]?.quantity * calculateOpeningBalance[index]?.rate;

        const purchaseQty = prevPurchaseData[index]?.totalQuantity ?? "_";
        const purchaseRate = prevPurchaseData[index]?.avgRate ?? "_";
        const purchaseAmount = prevPurchaseData[index]?.totalQuantity * prevPurchaseData[index]?.avgRate ?? "-";

        const issueQuantity = consumptionIssue[index]?.materialUsed;
        const issueAmount = consumptionIssue[index]?.amount;
        const issueRate =
        consumptionIssue[index]?.amount !== 0
            ? consumptionIssue[index]?.amount / consumptionIssue[index]?.materialUsed
            : 0;

        const closingQuantity = consumptionIssue[index]?.closingStock;
        const closingRate = consumptionIssue[index]?.rate;
        const closingAmount =
        consumptionIssue[index]?.closingStock !== 0
            ? consumptionIssue[index]?.closingStock * consumptionIssue[index]?.rate
            : 0;

        formattedData.push({
          date: dateStr,
          opening: {
            quantity: openingQty,
            rate: openingRate,
            amount: openingAmount,
          },
          purchase: {
            quantity: purchaseQty,
            rate: purchaseRate,
            amount: purchaseAmount,
          },
          issue: {
            quantity: issueQuantity,
            rate: issueRate,
            amount: issueAmount,
          },
          closing: {
            quantity: closingQuantity,
            rate: closingRate,
            amount: closingAmount,
          },
        });
      });
      console.log('formatedData',formattedData)
    };

    const processDateDefine = processStockData(
      prevPurchaseData,
      consumptionIssue,
      fromDate,
      toDate
    );
    // return consumptionIssue;
    console.log(processDateDefine);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
};

module.exports = {
  getConsumptionDB,
};
