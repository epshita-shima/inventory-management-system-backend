const mongoose =require('mongoose')

const iteminfoSchema=new mongoose.Schema({
    itemName: {type: String,required:true},
    sizeId: {type: String,required:true},
    unitId: {type: String,required:true},
    openingStock: {type: String,required:true},
    openingDate: {type: String,required:true},
    itemStatus: {type: Boolean,required:true},
    productionQtyPerBatch: {type: String,required:true},
    ledgerApproveStatus: {type: Boolean},
    ledgerApproveDate: {type: String},
    vocuherNo: { type: String },
    voucherDate: { type: String },
    makeBy: {type: String,required:true},
    updateBy: {type: String},
    makeDate: {type: String,required:true},
    updateDate: {type: String},
})

const ItemInfoModel=mongoose.model('fgiteminformation',iteminfoSchema)
module.exports=ItemInfoModel