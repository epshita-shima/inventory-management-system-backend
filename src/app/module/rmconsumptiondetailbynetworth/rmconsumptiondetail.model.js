const mongoose = require("mongoose");

const rmConsumptionDetailSchema = new mongoose.Schema({
  purchaseDate: { type: String, required: true },
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  materialUsed:{ type: Number, required: true },
  closingStock:{ type: Number, required: true },
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: Date, required: true }, 
  updateDate: { type: Date }, 
});

const RMConsumptionDetailModel = mongoose.model(
  "rmconsumptiondetailbyfifo",
  rmConsumptionDetailSchema
);
module.exports = RMConsumptionDetailModel;
