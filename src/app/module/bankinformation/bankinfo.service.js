const { errorlogger } = require('../../../shared/logger');
const BankInfoModel=require('./bankinfo.model')


async function getIBankInfoDB(){
    try {
        const bankInfo= await BankInfoModel.find();
        return bankInfo;
      } catch (error) {
        console.log("Error fetching item size:", error);
      }
}
async function insertBankInfoDB(bankInfoData) {
    try {
      return await BankInfoModel.insertMany(bankInfoData);
    } catch (error) {
      throw new Error("Error inserting payment info Data: " + error.message);
    }
}

module.exports={getIBankInfoDB,insertBankInfoDB}