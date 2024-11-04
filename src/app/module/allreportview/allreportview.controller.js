const ReportManagementService = require("./allreportview.service");

const getFiltredForReportInfoController = async (req, res) => {
  console.log("req query", req.query);
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  console.log(
    "report controller",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  ); // Assuming customerID is passed as a query parameter
  try {
    let filteredData;
    if (reportStatus == "orderdetailsreport") {
      filteredData =
        await ReportManagementService.getFilteredForOrderReportInfoDB(
          fromDate,
          toDate,
          itemId,
          clientId,
          piId,
          reportStatus
        );
      res.json(filteredData);
    }
    if (reportStatus == "ordersummaryreport") {
      filteredData =
        await ReportManagementService.getFilteredForOrderSummaryReportInfoDB(
          fromDate,
          toDate,
          itemId,
          clientId,
          piId,
          reportStatus
        );
      res.json(filteredData);
    }
    if (
      reportStatus === "salessummaryreport" ||
      reportStatus === "salesdetailsreport"
    ) {
      filteredData =
        await ReportManagementService.getFilteredForSalesReportInfoDB(
          fromDate,
          toDate,
          itemId,
          clientId,
          piId,
          reportStatus
        );
      res.json(filteredData);
    }
    if (
      reportStatus === "salesreturnsummaryreport" ||
      reportStatus === "salesreturndetailsreport"
    ) {
      filteredData =
        await ReportManagementService.getFilteredForSalesReturnReportInfoDB(
          fromDate,
          toDate,
          itemId,
          clientId,
          piId,
          reportStatus
        );
      res.json(filteredData);
    }
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = {
  getFiltredForReportInfoController,
};
