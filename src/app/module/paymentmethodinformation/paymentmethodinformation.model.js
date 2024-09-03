const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  paymentReceiveDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  itemId: { type: String, required: true },
  amount: { type: String, required: true },
  quantity: { type: String, required: true },
  bankName: { type: String, required: true },
  chequeNo: { type: String, required: true },
  chequeDate: { type: String, required: true },
  depositeSlipNo: { type: String, required: true },
  remarks:{ type: String, required: true },
});

const PaymentMethodInfoSchema = new Schema({
  clientId: { type: String, required: true },
  piNumber: { type: String, required: true },
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: Date, required: true, default: Date.now },
  updateDate: { type: Date },
  detailsData: [DetailsDataSchema],
});
const PaymentMethodInfoModel = mongoose.model(
  "paymentMethodinformation",
  PaymentMethodInfoSchema
);
module.exports = PaymentMethodInfoModel;
