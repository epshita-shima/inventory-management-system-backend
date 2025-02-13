const StockReportService = require("./stockreport.service");

const getFiltredForStockReportInfoController = async (req, res) => {
  const { fromDate, toDate } = req.query;
  console.log('fromDate, toDate',fromDate, toDate)
  try {
    const getData =await StockReportService.getRawMaterialStockReportDB(
      fromDate,
      toDate
    );
    res.json(getData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }

};
const getFiltredForFinishStockReportInfoController = async (req, res) => {
  const { fromDate, toDate } = req.query;
  console.log('fromDate, toDate',fromDate, toDate)
  try {
    const getData =await StockReportService.getFinishGoodsStockReportDB(
      fromDate,
      toDate
    );
    res.json(getData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }

};

module.exports = {
  getFiltredForStockReportInfoController,
  getFiltredForFinishStockReportInfoController
};
