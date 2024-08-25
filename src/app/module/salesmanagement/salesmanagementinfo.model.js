const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  itemId: { type: String, required: true },
  description: { type: String, required: true },
  unitId: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number },
  totalAmount: { type: Number },
});

const salesManagementInfoSchema = new mongoose.Schema({
  PIDate: { type: String, required: true },
  expireDate: { type: String, required: true },
  invoiceNo: { type: String, required: true },
  customerID: { type: String, required: true },
  currency: { type: String, required: true },
  detailsData: [DetailsDataSchema],
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: String, required: true },
  updateDate: { type: String },
});

const SalesManagementModel = mongoose.model(
  "invoiceinformation",
  salesManagementInfoSchema
);
module.exports = SalesManagementModel;
