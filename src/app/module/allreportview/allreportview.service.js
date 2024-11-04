const OrderManagementModel = require("../salesmanagement/salesmanagementinfo.model");
const SalesManagementModel = require("../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const SalesReturnManagementModel = require("../deliveredreturninformation/deliveredreturninformation.model");
const mongoose = require("mongoose");

async function getFilteredForOrderReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.piDate = fromDate;
    }
    if (toDate) {
      filter.piDate = toDate;
    }
    if (fromDate && toDate) {
      filter.piDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.customerID = clientId;
    }

    if (piId) {
      filter._id = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await OrderManagementModel.find(filter).lean();
    if (itemId) {
      console.log("reportStatus", reportStatus);
      const filteredData = data.flatMap((detail) => {
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          return [{ ...detail, detailsData: matchedDetails }];
        }
        return [];
      });
console.log("filteredData detaiks",filteredData)
      return filteredData;
    } else {
      console.log("report orderdetailsreport data", data);
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}
async function getFilteredForOrderSummaryReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.piDate = fromDate;
    }
    if (toDate) {
      filter.piDate = toDate;
    }
    if (fromDate && toDate) {
      filter.piDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.customerID = clientId;
    }

    if (piId) {
      filter._id = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await OrderManagementModel.find(filter).lean();
    if (itemId) {
      console.log("reportStatus sumary", reportStatus);
      const filteredData = data.flatMap((detail) => {
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          return [{ ...detail, detailsData: matchedDetails }];
        }
        return [];
      });

      const summaryData = filteredData.reduce((acc, detail) => {
        detail.detailsData.forEach((item) => {
          const itemDate = new Date(detail.piDate);
          const dateString = itemDate.toISOString().split("T")[0];

          if (!acc[dateString]) {
            acc[dateString] = {
              grandQuantity: 0,
              grandAmount: 0,
            };
          }

          acc[dateString].grandQuantity += item.quantity || 0;
          acc[dateString].grandAmount += item.totalAmount || 0;
          acc[dateString].paymentType = detail.paymentId || "";
        });
        return acc;
      }, {});

      const resultSummaryData = Object.entries(summaryData).map(
        ([date, totals]) => ({
          date,
          paymentType: totals.paymentType,
          grandQuantity: totals.grandQuantity,
          grandAmount: totals.grandAmount,
          averageRate: totals.grandQuantity
            ? Math.round(totals.grandAmount / totals.grandQuantity)
            : 0,
        })
      );
      console.log("resultSummaryData", resultSummaryData);
      return resultSummaryData;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForSalesReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.finishGoodsDeliveryDate = fromDate;
    }
    if (toDate) {
      filter.finishGoodsDeliveryDate = toDate;
    }
    if (fromDate && toDate) {
      filter.finishGoodsDeliveryDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.clientId = clientId;
    }

    if (piId) {
      filter.piId = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await SalesManagementModel.find(filter).lean();
    if (itemId) {
      const filteredData = data.flatMap((detail) => {
        // Filter detailsData within each object based on itemId
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          // Replace detailsData with matchedDetails
          return [{ ...detail, detailsData: matchedDetails }];
        }

        return [];
      });
      return filteredData;
    } else {
      console.log("report salesdetailsreport data", data);
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForSalesReturnReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.returnDate = fromDate;
    }
    if (toDate) {
      filter.returnDate = toDate;
    }
    if (fromDate && toDate) {
      filter.returnDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.clientId = clientId;
    }

    if (piId) {
      filter.piId = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }
    const data = await SalesReturnManagementModel.find(filter).lean();
    if (itemId) {
      const filteredData = data.flatMap((detail) => {
        // Filter detailsData within each object based on itemId
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          // Replace detailsData with matchedDetails
          return [{ ...detail, detailsData: matchedDetails }];
        }
        return [];
      });
      return filteredData;
    } else {
      console.log("report sales retun detailsreport data", data);
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}
module.exports = {
  getFilteredForOrderReportInfoDB,
  getFilteredForSalesReportInfoDB,
  getFilteredForOrderSummaryReportInfoDB,
  getFilteredForSalesReturnReportInfoDB,
};
