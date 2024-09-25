const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  itemId: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number },
  totalAmount: { type: Number },
  specialApproveForDelivary:{type: Boolean,required:true},
  specialApproveBy:{type: String},
  specialApproveDate:{type: Date},
});

const salesManagementInfoSchema = new mongoose.Schema({
  piDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  invoiceNo: { type: String, required: true },
  customerID: { type: String, required: true },
  paymentId: { type: String, required: true },
  currency: { type: String, required: true },
  approveBy:{ type: String, },
  approveDate:{ type: Date },
  isApproved:{type: Boolean,required:true},
  mktPerson:{ type: String, required: true },
  detailsData: [DetailsDataSchema],
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: Date, required: true },
  updateDate: { type: Date },
});

const SalesManagementModel = mongoose.model(
  "invoiceinformation",
  salesManagementInfoSchema
);
module.exports = SalesManagementModel;
