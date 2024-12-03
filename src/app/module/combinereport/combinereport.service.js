const GRNSModel = require("../goodsreceivenoteinformation/grninfo.model");
const OrderModel = require("../salesmanagement/salesmanagementinfo.model");
const ProductionModel = require("../productioninformation/productioninfo.model");
const SalesModel = require("../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const ReturnModel=require("../deliveredreturninformation/deliveredreturninformation.model")

async function getFilteredForManagementCombineReportDB(fromDate, toDate) {
  console.log("combine service", fromDate, toDate); // Fixing the typo
  try {
    const purchasefilter = {};
    const orderFilter = {};
    const salesFilter = {};
    const productionFilter = {};
    const returnFilter={}
    // Create filter based on the dates provided
    if (fromDate) {
      purchasefilter.receiveDate = fromDate; // Use Date object directly
      orderFilter.piDate = new Date(fromDate);
      salesFilter.finishGoodsDeliveryDate = new Date(fromDate);
      productionFilter.productionDate =fromDate;
      returnFilter.returnDate=new Date(fromDate);
    }

    if (toDate) {
      purchasefilter.receiveDate = toDate;
      orderFilter.piDate = new Date(toDate);
      salesFilter.finishGoodsDeliveryDate = new Date(toDate);
      productionFilter.productionDate = toDate;
      returnFilter.returnDate=new Date(toDate);
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
    const orderData = await OrderModel.find(orderFilter).lean();
    const salesData = await SalesModel.find(salesFilter).lean();
    const productionData = await ProductionModel.find(productionFilter).lean();
    const returnData = await ReturnModel.find(returnFilter).lean();

    return { purchaseData, orderData, salesData, productionData ,returnData};

  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching payment method info");
  }
}

module.exports = { getFilteredForManagementCombineReportDB };
