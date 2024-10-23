const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  piDetailsId:{ type: String, required: true },
  itemId: { type: String, required: true },
  previousDelivaryQty: { type: String, required: true },
  dueQty: { type: String, required: true },
  deliverQty: { type: String, required: true },
  piId: { type: String, required: true },
  returnStatus:{ type: Boolean, required: true },
  returnId:{ type: String },
});

const DOInfoSchema = new Schema({
  piId: { type: String, required: true },
  doNo: { type: String, required: true },
  clientId:{ type: String, required: true },
  mushokChallanNo: { type: String },
  deliveryChallanNo: { type: String, required: true },
  shipmentNo:{ type: String, required: true },
  approveStatus: { type: Boolean, required: true },
  approveBy: { type: String},
  approveDate:  { type: Date},
  deliveryStatus:{type:Boolean,required: true},
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: Date, required: true, default: Date.now },
  updateDate: { type: Date },
  detailsData: [DetailsDataSchema],
});

const DOInfoModel = mongoose.model(
  "deliveryorderinformation",
  DOInfoSchema
);
module.exports = DOInfoModel;