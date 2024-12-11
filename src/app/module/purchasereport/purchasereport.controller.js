const PurchaseReportService=require('./purchasereport.service')


const getFiltredForPurchaseDetailsReportController = async (req, res) => {
  const { fromDate, toDate, itemId, supplierId, poId, reportStatus } = req.query;
  console.log('purchase controller',req.query)
  try {
    const  filteredData =
        await PurchaseReportService.getFilteredForPurchaseReporDB(
          fromDate,
          toDate,
          itemId,
          supplierId,
          poId,
          reportStatus
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getFiltredForPurchaseSummaryReportController = async (req, res) => {
  const { fromDate, toDate, itemId, supplierId, poId, reportStatus } = req.query;
  console.log('purchase controller',req.query)
  try {
    const  filteredData =
        await PurchaseReportService.getFilteredForSalesSummaryReportInfoDB(
          fromDate,
          toDate,
          itemId,
          supplierId,
          poId,
          reportStatus
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
module.exports={
  getFiltredForPurchaseDetailsReportController,
  getFiltredForPurchaseSummaryReportController
}