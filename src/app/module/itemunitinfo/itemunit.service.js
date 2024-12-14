const { errorlogger } = require('../../../shared/logger');
const ItemUnitInfoModel=require('./itemunit.model')

async function getItemUnitDB(){
    try {
        const itemunits= await ItemUnitInfoModel.find();
        return itemunits;
      } catch (error) {
        errorlogger.error("Error fetching items unit:", error);
      }
}

async function insertItemUnitDB(itemunit){
    try {
        return await ItemUnitInfoModel.insertMany(itemunit)
    } catch (error) {
        throw new Error("Error inserting items unit: " + error.message);
    }
}
module.exports={getItemUnitDB,insertItemUnitDB}