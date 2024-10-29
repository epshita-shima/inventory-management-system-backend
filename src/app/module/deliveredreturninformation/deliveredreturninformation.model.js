const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  piDetailsId: { type: String, required: true },
  itemId: { type: String, required: true },
  returnQty: { type: String, required: true },
  deliveredQty: { type: String, required: true },
  deliveryChallanNo: { type: String, required: true },
  piId: { type: String, required: true },
  doId: { type: String, required: true },
});

const DeliveredReturnInfoSchema = new Schema({
  returnDate: { type: Date, required: true },
  piId: { type: String, required: true },
  doId: { type: String, required: true },
  deliveredId:{ type: String, required: true },
  transferFromClientId:{ type: String, required: true},
  transferToCompanyId:{ type: String, required: true },
  clientId: { type: String, required: true },
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: Date, required: true, default: Date.now },
  updateDate: { type: Date },
  detailsData: [DetailsDataSchema],
});

const DeliveredReturnInfoModel = mongoose.model(
  "returndeliveredinformation",
  DeliveredReturnInfoSchema
);
module.exports = DeliveredReturnInfoModel;
