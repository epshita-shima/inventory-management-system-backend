const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  piDetailsId:{ type: String, required: true},
  itemId: { type: String, required: true },
  deliverQty: { type: String, required: true },
  piId:{ type: String, required: true },
  doId:{ type: String, required: true },
});

const FinishGoodsDeliveryInfoSchema = new Schema({
  finishGoodsDeliveryDate:{ type: Date,required:true},
  piId:{ type: String, required: true },
  doId:{ type: String, required: true },
  driverName:{ type: String, required: true },
  driverContactNo:{ type: String, required: true },
  truckNo:{ type: String, required: true },
  clientId:{ type: String, required: true },
  totalDelivarQty:{ type: Number, required: true },
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