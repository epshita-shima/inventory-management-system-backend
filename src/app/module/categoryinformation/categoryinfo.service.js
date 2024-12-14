const { errorlogger } = require("../../../shared/logger");
const CategoryInfoModal = require("./categoryinfo.model");

async function getCategoryInfoDB(){
    try {
        const categoryInfo = await CategoryInfoModal.find();
        return categoryInfo;
      } catch (error) {
        errorlogger.error("Error fetching item size:", error);
      }
}
async function insertCategoryInfoDB(categoryData) {
    try {
      return await CategoryInfoModal.insertMany(categoryData);
    } catch (error) {
      throw new Error("Error inserting categoryData: " + error.message);
    }
  }

  module.exports = {
    getCategoryInfoDB,
    insertCategoryInfoDB

  }