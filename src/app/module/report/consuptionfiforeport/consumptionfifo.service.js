const ConsumptionModel=require('../../rmconsumptiondetailbynetworth/rmconsumptiondetail.model');

const getConsumptionDB=async(fromDate,toDate,itemId)=>{
try {
  const filter={}
  if(fromDate){
    filter.purchaseDate=fromDate;
  }
  if(toDate){
    filter.purchaseDate=toDate;
  }
  if(fromDate && toDate){
    filter.purchaseDate={$gte:fromDate , $lte:toDate}
  }
  if(itemId){
    filter.itemId=itemId
  }
  console.log('filter',filter)
  // const detailConsuption1=await ConsumptionModel.find()

  const detailConsuption=await ConsumptionModel.find(filter)
  console.log('data',detailConsuption)

  if (!detailConsuption.length) return []
  return detailConsuption
} catch (error) {
  console.log(error);
  throw new Error("Error fetching payment method info");
}
}

module.exports={
  getConsumptionDB
}