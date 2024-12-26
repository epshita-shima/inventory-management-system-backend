const { errorlogger } = require("../../../shared/logger");
const ItemsizeModal = require("./itemsize.model");

async function getItemSizesDB(){
    try {
        const itemsizes = await ItemsizeModal.find();
        return itemsizes;
      } catch (error) {
        console.log("Error fetching item size:", error);
      }
}
async function insertItemSizesDB(itemssize) {
    try {
      return await ItemsizeModal.insertMany(itemssize);
    } catch (error) {
      throw new Error("Error inserting items size: " + error.message);
    }
  }

  module.exports = {
    getItemSizesDB,
    insertItemSizesDB

  }