const CombineService=require('./combinereport.service')

const getFiltredForManagementCombineReportController = async (
  req,
  res
) => {
  const { fromDate, toDate } = req.query;

  try {
    const filteredData =
      await CombineService.getFilteredForManagementCombineReportDB(fromDate,toDate);
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};


module.exports = {getFiltredForManagementCombineReportController}
