const OrderManagementModel = require("../salesmanagement/salesmanagementinfo.model");
const SalesManagementModel = require("../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const mongoose = require("mongoose");

async function getFilteredForOrderReportInvoiceInfoDB(
  fromDate,
  toDate,
  clientId,
  piId,
  reportStatus
) {
  console.log("report db 2", fromDate, toDate, clientId, piId, reportStatus);
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

      const data = await OrderManagementModel.find(filter);
      console.log("report orderdetailsreport data", data);
      return data;
    
   
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}
async function getFilteredForSalesReportInvoiceInfoDB(
  fromDate,
  toDate,
  clientId,
  piId,
  reportStatus
) {
  console.log("report db 2", fromDate, toDate, clientId, piId, reportStatus);
  try {
    const filter = {};
    if (fromDate) {
      filter.
      finishGoodsDeliveryDate = fromDate;
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
  
      const data = await SalesManagementModel.find(filter);
      console.log("report salesdetailsreport data", data);
      return data;
  
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}
module.exports = {
  getFilteredForOrderReportInvoiceInfoDB,
  getFilteredForSalesReportInvoiceInfoDB
};
