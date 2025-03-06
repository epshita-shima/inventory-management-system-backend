const SalesService=require('./chart.service')


const getFiltredForSalesTotalController = async (req, res, next) => {
  const data = req.body;
  const salesTotalAmount = await SalesService.getSalesTotalDB(data);
  res.json(salesTotalAmount);
};



module.exports = {getFiltredForSalesTotalController}