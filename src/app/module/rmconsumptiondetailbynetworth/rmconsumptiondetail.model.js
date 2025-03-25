const mongoose = require("mongoose");

const rmConsumptionDetailSchema = new mongoose.Schema({
  purchaseDate: { type: String, required: true },
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  materialUsed:{ type: Number, required: true },
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: String, required: true },
  updateDate: { type: String },
});

const RMConsumptionDetailModel = mongoose.model(
  "rmconsumptiondetailbyfifo",
  rmConsumptionDetailSchema
);
module.exports = RMConsumptionDetailModel;
