const { model } = require("mongoose");
const ProductionService = require("./productionreport.service");

const getFiltredForProductionDatewiseDetailsReportController = async (
  req,
  res
) => {
  const { fromDate, toDate, productionItemName, batchNo } = req.query;
  try {
    const filteredData =
      await ProductionService.getFilteredForProductionDatewiseDetailsReportInfoDB(
        fromDate,
        toDate,
        productionItemName,
        batchNo
      );
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForProductionDatewiseSummaryReportController = async (
  req,
  res
) => {
  const { fromDate, toDate, productionItemName, batchNo } = req.query;
  try {
    const filteredData =
      await ProductionService.getFilteredForProductionDatewiseSummaryReportInfoDB(
        fromDate,
        toDate,
        productionItemName,
        batchNo
      );
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForProductionItemwiseSummaryReportController = async (
  req,
  res
) => {
  const { fromDate, toDate, productionItemName, batchNo } = req.query;
  try {
    const filteredData =
      await ProductionService.getFilteredForProductionItemwiseDetailsReportInfoDB(
        fromDate,
        toDate,
        productionItemName,
        batchNo
      );
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
const getFiltredForRawMaterialConsumptionDetailsReportController = async (
  req,
  res
) => {
  try {
    const { fromDate, toDate, itemId } = req.query;
    const filteredData =
      await ProductionService.getFilteredForRawMaterialConsumptionDetailsReportInfoDB(
        fromDate,
        toDate,
        itemId
      );

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
const getFiltredForRawMaterialConsumptionSummaryReportController = async (
  req,
  res
) => {
  const { fromDate, toDate, itemId } = req.query;
  try {
    const filteredData =
      await ProductionService.getFilteredForRawMaterialConsumptionSummaryReportInfoDB(
        fromDate,
        toDate,
        itemId
      );
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = {
  getFiltredForProductionDatewiseDetailsReportController,
  getFiltredForProductionDatewiseSummaryReportController,
  getFiltredForProductionItemwiseSummaryReportController,
  getFiltredForRawMaterialConsumptionDetailsReportController,
  getFiltredForRawMaterialConsumptionSummaryReportController,
};
