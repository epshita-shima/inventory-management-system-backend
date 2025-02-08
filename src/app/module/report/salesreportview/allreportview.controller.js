const ReportManagementService = require("./allreportview.service");

const getFiltredForReportInfoController = async (req, res) => {
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  try {
    const  filteredData =
        await ReportManagementService.getFilteredForOrderReportInfoDB(
          fromDate,
          toDate,
          itemId,
          clientId,
          piId,
          reportStatus
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForOrderSummaryReportInfoController = async (req, res) => {
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
    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForSalesDetailsReportInfoController = async (req, res) => {
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  try {
    const filteredData =
      await ReportManagementService.getFilteredForSalesReportInfoDB(
        fromDate,
        toDate,
        itemId,
        clientId,
        piId,
        reportStatus
      );
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForSalesSummaryReportInfoController = async (req, res) => {
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
    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
const getFiltredForReturnDetailsReportInfoController = async (req, res) => {
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  try {
    const filteredData =
      await ReportManagementService.getFilteredForSalesReturnReportDetailsInfoDB(
        fromDate,
        toDate,
        itemId,
        clientId,
        piId,
        reportStatus
      );
    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForReturnSummaryReportInfoController = async (req, res) => {
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  try {
    const filteredData =
      await ReportManagementService.getFilteredForSalesReturnSummaryReportInfoDB(
        fromDate,
        toDate,
        itemId,
        clientId,
        piId,
        reportStatus
      );
    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
const getFiltredForCombineReportInfoController = async (req, res) => {
  const { fromDate, toDate, itemId, clientId, piId, reportStatus } = req.query;
  try {
    const filteredData =
      await ReportManagementService.getFilteredForCombineReport(
        fromDate,
        toDate,
        itemId,
        clientId,
        piId,
        reportStatus
      );
    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = {
  getFiltredForReportInfoController,
  getFiltredForOrderSummaryReportInfoController,
  getFiltredForSalesDetailsReportInfoController,
  getFiltredForSalesSummaryReportInfoController,
  getFiltredForReturnDetailsReportInfoController,
  getFiltredForReturnSummaryReportInfoController,
  getFiltredForCombineReportInfoController
};
