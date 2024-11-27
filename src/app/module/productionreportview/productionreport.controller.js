const { model } = require('mongoose');
const ProductionService=require('./productionreport.service')

const getFiltredForProductionDatewiseDetailsReportController = async (req, res) => {
  const { fromDate, toDate, productionItemName,batchNo, reportStatus } = req.query;
  try {

    console.log('controller',fromDate, toDate, productionItemName,batchNo, reportStatus)
    const  filteredData =
        await ProductionService.getFilteredForProductionDatewiseDetailsReportInfoDB(
          fromDate,
          toDate,
          productionItemName,
          batchNo,
          reportStatus
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForProductionDatewiseSummaryReportController = async (req, res) => {
  const { fromDate, toDate, productionItemName,batchNo, reportStatus } = req.query;
  try {

    console.log('controller',fromDate, toDate, productionItemName,batchNo, reportStatus)
    const  filteredData =
        await ProductionService.getFilteredForProductionDatewiseSummaryReportInfoDB(
          fromDate,
          toDate,
          productionItemName,
          batchNo,
          reportStatus
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForProductionItemwiseSummaryReportController = async (req, res) => {
  const { fromDate, toDate, productionItemName,batchNo, reportStatus } = req.query;
  try {

    const  filteredData =
        await ProductionService.getFilteredForProductionItemwiseDetailsReportInfoDB(
          fromDate,
          toDate,
          productionItemName,
          batchNo,
          reportStatus
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
const getFiltredForRawMaterialConsumptionDetailsReportController = async (req, res) => {
  const { fromDate, toDate, itemId,reportStatus } = req.query;
  try {

    const  filteredData =
        await ProductionService.getFilteredForRawMaterialConsumptionDetailsReportInfoDB(
          fromDate,
          toDate,
          itemId,
          reportStatus
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports={getFiltredForProductionDatewiseDetailsReportController,getFiltredForProductionDatewiseSummaryReportController,getFiltredForProductionItemwiseSummaryReportController,
  getFiltredForRawMaterialConsumptionDetailsReportController
}
