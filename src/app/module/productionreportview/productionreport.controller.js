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

module.exports={getFiltredForProductionDatewiseDetailsReportController,getFiltredForProductionDatewiseSummaryReportController}
