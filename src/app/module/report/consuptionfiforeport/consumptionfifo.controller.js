const ConsumptionService=require('./consumptionfifo.service');

const getConsumptionController=async(req,res)=>{
  try {
    console.log('req.query',req.query)
    const {fromDate,toDate,itemId}=req.query;

    const sendData=await ConsumptionService.getConsumptionDB(fromDate,toDate,itemId)
    res.json(sendData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
 
}
module.exports={getConsumptionController}