const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailsDataSchema = new Schema({
    pOSingleId:{ type: String, required: true },
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    previousReceivedQuantity:{ type: Number, required: true },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
  });
  
const goodsReceiveNoteSchema = new mongoose.Schema({
    pOSingleId:{ type: String, required: true},
    grnSerialNo:{ type: String, required: true},
    supplierId: {type: String,required:true},
    supplierPoNo: {type: String,required:true},
    receiveDate: {type: String,required:true},
    challanNo:{type: String,required:true},
    grandTotalQuantity:{type: String,required:true},
    grandTotalReceivedQuantity:{type: String,required:true},
    grandTotalAmount: {type: String,required:true},
    detailsData: [DetailsDataSchema],
    isAccountPostingStatus: {type:Boolean,required:true},
    vocuherNo: {type: String},
    voucherDate: {type: String},
    makeBy: {type: String,required:true},
    updateBy: {type: String},
    makeDate:{type: String,required:true},
    updateDate: {type: String},
});

const GoodsReceiveNoteInfoModel = mongoose.model("GoodsReceiveNoteInfo", goodsReceiveNoteSchema);
module.exports = GoodsReceiveNoteInfoModel;