const ReportManagementService = require("./allreportview.service");

const getFiltredForReportInvoiceInfoController = async (req, res) => {
  console.log("req query",req.query)
  const { fromDate,toDate,itemId,clientId,piId ,reportStatus} = req.query;
  console.log('report controller',fromDate,toDate,itemId,clientId,piId,reportStatus) // Assuming customerID is passed as a query parameter
  try {
    if(reportStatus=="orderdetailsreport" || reportStatus=="ordersummaryreport"){
      const filteredData = await ReportManagementService.getFilteredForOrderReportInvoiceInfoDB(fromDate,toDate,clientId,piId,reportStatus);
      res.json(filteredData);
    }

   if(reportStatus==="salessummaryreport" || reportStatus==="salesdetailsreport" ){
    const filteredData = await ReportManagementService.getFilteredForSalesReportInvoiceInfoDB(fromDate,toDate,clientId,piId,reportStatus);
    res.json(filteredData);
   }
   if(reportStatus==="salesreturnsummaryreport" || reportStatus==="salesreturndetailsreport" ){
    const filteredData = await ReportManagementService.getFilteredForSalesReturnReportInvoiceInfoDB(fromDate,toDate,clientId,piId,reportStatus);
    res.json(filteredData);
   }
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};

module.exports = {
  getFiltredForReportInvoiceInfoController,

};
