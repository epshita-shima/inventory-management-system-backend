const mongoose =require('mongoose')

const rmIteminfoSchema=new mongoose.Schema({
    itemName: {type: String,required:true},
    categoryId:{type: String,required:true},
    unitId: {type: String,required:true},
    openingStock: {type: String,required:true},
    openingDate: {type: String,required:true},
    description:{type: String,required:true},
    itemStatus: {type: Boolean,required:true},
    ledgerApproveStatus: {type: Boolean},
    ledgerApproveDate: {type: String},
    vocuherNo: { type: String },
    voucherDate: { type: String },
    makeBy: {type: String,required:true},
    updateBy: {type: String},
    makeDate: {type: String,required:true},
    updateDate: {type: String},
})

const RMItemInfoModel=mongoose.model('rmiteminformation',rmIteminfoSchema)
module.exports=RMItemInfoModel