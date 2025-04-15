const ConsumptionModel = require("../../rmconsumptiondetailbynetworth/rmconsumptiondetail.model");
const GRNModel = require("../../goodsreceivenoteinformation/grninfo.model");

const getConsumptionDB = async (fromDate, toDate, itemId) => {
  try {
    const filter = {};
    if (fromDate) {
      filter.purchaseDate = fromDate;
    }
    if (toDate) {
      filter.purchaseDate = toDate;
    }
    if (fromDate && toDate) {
      filter.purchaseDate = { $gte: fromDate, $lte: toDate };
    }
    if (itemId) {
      filter.itemId = itemId;
    }
    const prevPurchaseDate = await GRNModel.find({ receiveDate: { $lt: fromDate } });
     
    const detailConsumption = await ConsumptionModel.find(filter);
    const purchaseData = await GRNModel.find(filter);
    console.log("purchaseData", purchaseData);
    console.log("data", detailConsumption);

   

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
      purchaseData,
      detailConsumption,
      fromDate,
      toDate
    ) => {
      const dateRange = getDateRange(fromDate, toDate);
      const formattedData = [];

      let prevClosing = {
        item: "",
        qty: 0,
        rate: 0,
        amount: 0,
      };

      dateRange.forEach((dateStr, index) => {
        const purchase = purchaseData.find(
          (date) => date.receiveDate === dateStr
        );
        const issueData = detailConsumption.find(
          (date) =>
            new Date(date.makeDate).toLocaleDateString("en-CA") === dateStr
        );
        const prevDate = new Date(dateStr);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().split("T")[0];

        const prevDayData = detailConsumption.find(
          (d) =>
            new Date(date.makeDate).toLocaleDateString("en-CA") === prevDateStr
        );
        const todayIssue = detailConsumption.find(
          (d) =>
            new Date(date.makeDate).toLocaleDateString("en-CA") === dateStr &&
            typeof d.materialUsed === "number"
        );

        console.log("prevDateStr", prevDateStr);
        const openingItem = prevClosing.item;
        const openingQty = prevClosing.qty;
        const openingRate = prevClosing.rate;
        const openingAmount = prevClosing.qty * prevClosing.rate;

        const purchaseItem = purchase?.itemId;
        const purchaseQty = purchase?.quantity ?? "_";
        const purchaseRate = purchase?.unitPrice ?? "_";
        const purchaseAmount = purchase?.quantity * purchase?.unitPrice ?? "-";

        formattedData.push({
          date: dateStr,
          opening: {
            itemName: openingItem,
            quantity: openingQty,
            rate: openingRate,
            amount: openingAmount,
          },
          purchase: {
            itemName: purchaseItem,
            quantity: purchaseQty,
            rate: purchaseRate,
            amount: purchaseAmount,
          },
        });
      });
      // console.log('formatedData',formattedData)
    };

    const processDateDefine = processStockData(
      purchaseData,
      detailConsumption,
      fromDate,
      toDate
    );
    // return detailConsumption;
    console.log(processDateDefine);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
};

module.exports = {
  getConsumptionDB,
};
