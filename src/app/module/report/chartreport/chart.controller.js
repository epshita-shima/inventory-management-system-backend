const SalesService=require('./chart.service')


const getFiltredForSalesTotalController = async (req, res, next) => {
  const { fromDate, toDate } = req.query;
  const salesTotalAmount = await SalesService.getSalesTotalDB(fromDate, toDate);
  res.json(salesTotalAmount);
};



module.exports = {getFiltredForSalesTotalController}