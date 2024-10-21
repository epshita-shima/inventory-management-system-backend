const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  piDetailsId:{ type: String, required: true},
  itemId: { type: String, required: true },
  deliverQty: { type: String, required: true },
  piNumber: { type: String, required: true },
});

const FinishGoodsDeliveryInfoSchema = new Schema({
  piNumber: { type: String, required: true },
  doNo: { type: String, required: true },
  clientId:{ type: String, required: true },
  approveStatus: { type: Boolean, required: true },
  approveBy: { type: String},
  approveDate:  { type: Date},
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: Date, required: true, default: Date.now },
  updateDate: { type: Date },
  detailsData: [DetailsDataSchema],
});

const FinishGoodsDeliveryInfoModel = mongoose.model(
  "finishgoodsdeliveryinformation",
  FinishGoodsDeliveryInfoSchema
);
module.exports = FinishGoodsDeliveryInfoModel;