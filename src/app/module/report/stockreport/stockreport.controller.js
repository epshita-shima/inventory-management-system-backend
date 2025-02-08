const StockReportService = require("./stockreport.service");

const getFiltredForStockReportInfoController = async (req, res) => {
  const { fromDate, toDate } = req.query;
  try {
    const getData =await StockReportService.getRawMaterialStockReportDB(
      fromDate,
      toDate
    );
    res.json(getData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }

  // return res.status(200).json(getData);
};

module.exports = {
  getFiltredForStockReportInfoController,
};
