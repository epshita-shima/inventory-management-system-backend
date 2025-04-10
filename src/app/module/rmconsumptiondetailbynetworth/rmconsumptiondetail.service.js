const RawMaterialConsumptionModel=require('./rmconsumptiondetail.model')

async function getRawMaterialConsimptionDB(){
  try {
    const rawConsumptionData= await RawMaterialConsumptionModel.find();
    return rawConsumptionData;
  } catch (error) {
    console.log('Error featching raw consumption data',error)
  }
}

async function insertRawMaterialConsumptiontDB(rawConsumption) {
  try {
    return await RawMaterialConsumptionModel.insertMany(rawConsumption);
  } catch (error) {
    throw new Error("Error inserting items: " + error.message);   
  }
}

module.exports={getRawMaterialConsimptionDB,insertRawMaterialConsumptiontDB}