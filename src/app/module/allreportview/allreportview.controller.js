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
      console.log("details order");
      res.json(filteredData);
    }
     else if (
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
    } else if (
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
    } else {
      console.error("Unknown reportStatus:", reportStatus);
      return res
        .status(400)
        .json({ success: false, message: "Invalid reportStatus provided" });
    }
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
const getFiltredForOrderSummaryReportInfoController = async (req, res) => {
  console.log("req query", req.query);
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  try {
    const filteredData =
      await ReportManagementService.getFilteredForOrderSummaryReportInfoDB(
        fromDate,
        toDate,
        itemId,
        clientId,
        piId,
        reportStatus
      );
    console.log("summary");
    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForSalesSummaryReportInfoController = async (req, res) => {
  console.log("req query", req.query);
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  try {
    const filteredData =
      await ReportManagementService.getFilteredForSalesSummaryReportInfoDB(
        fromDate,
        toDate,
        itemId,
        clientId,
        piId,
        reportStatus
      );
    console.log("summary");
    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = {
  getFiltredForReportInfoController,
  getFiltredForOrderSummaryReportInfoController,
  getFiltredForSalesSummaryReportInfoController
};
