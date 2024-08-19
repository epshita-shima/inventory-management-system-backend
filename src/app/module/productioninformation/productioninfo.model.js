const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
  itemId: { type: String, required: true },
  receipe: { type: String, required: true },
  materialUsed: { type: Number, required: true },
  asPerRatio: { type: Number, required: true },
  excess: { type: Number },
  less: { type: Number },
  consumtionStatus:{ type: String, required: true },
});

const ProductionInfoSchema = new Schema({
  productionDate: { type: String, required: true },
  batchNo: { type: String, required: true },
  totalBatch: { type: String, required: true },
  receipeQtyRatio: { type: String, required: true },
  productionItemName: { type: String, required: true },
  productionQty: { type: Number, required: true },
  productionStart: { type: String, required: true },
  productionEnd: { type: String, required: true },
  totalHour: { type: Number, required: true },
  wastageQty: { type: Number, required: true },
  expectedProductionQtyPerBatch: { type: Number, required: true },
  expectedProductionQty: { type: Number, required: true },
  excessOrLessProductionQty: { type: Number, required: true },
  productionStatus:{ type: String, required: true },
  makeBy: { type: String, required: true },
  updateBy: { type: String },
  makeDate: { type: Date, required: true, default: Date.now },
  updateDate: { type: Date },
  detailsData: [DetailsDataSchema],

});
const ProductionInfoInfoModel = mongoose.model(
  "prodctioninformation",
  ProductionInfoSchema
);
module.exports = ProductionInfoInfoModel;
