const PurchaseReportService=require('./purchasereport.service')


const getFiltredForPurchaseDetailsReportController = async (req, res) => {
  const { fromDate, toDate, itemId, supplierId, poId, reportStatus } = req.query;
  try {
    const  filteredData =
        await PurchaseReportService.getFilteredForPurchaseDetailsReporDB(
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
console.log(fromDate, toDate, itemId, supplierId, poId, reportStatus)
  try {
    const  filteredData =
        await PurchaseReportService.getFilteredForPurchaseSummaryReportInfoDB(
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
const getFiltredForPurchaseItemReportController = async (req, res) => {
  const { itemId } = req.query;
  try {
    const  filteredData =
        await PurchaseReportService.getFilteredForPurchaseItemReportInfoDB(
          itemId
        );
      res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
module.exports={
  getFiltredForPurchaseDetailsReportController,
  getFiltredForPurchaseSummaryReportController,
  getFiltredForPurchaseItemReportController
}