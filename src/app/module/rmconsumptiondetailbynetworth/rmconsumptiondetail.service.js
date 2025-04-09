const RawMaterialConsumptionModel=require('./rmconsumptiondetail.model')

async function insertRawMaterialConsumptiontDB(rawConsumption) {
  try {
    console.log('rawConsumption',rawConsumption)
    return await RawMaterialConsumptionModel.insertMany(rawConsumption);
  } catch (error) {
    throw new Error("Error inserting items: " + error.message);
  }
}

module.exports={insertRawMaterialConsumptiontDB}