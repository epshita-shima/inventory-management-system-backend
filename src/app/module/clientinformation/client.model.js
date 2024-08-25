const mongoose =require('mongoose')

const clientInfoSchema=new mongoose.Schema({
        clientName: {type: String,required:true},
        clientShortName: {type: String,required:true},
        email: {type: String,required:true},
        mobileNo: {type: String,required:true},
        contactPerson: {type: String,required:true},
        binNo: {type: String,required:true},
        tinNo: {type: String,required:true},
        address: {type: String,required:true},
        remarks:{type: String},
        isActive: {type: Boolean,required:true},
        clientApproveStatus: {type: Boolean,required:true},
        clientApproveDate: {type: String},
        isAccountPostingStatus: { type: Boolean, required: true },
        vocuherNo: { type: String },
        voucherDate: { type: String },
        makeBy: {type: String,required:true},
        updateBy: {type: String},
        makeDate:{type: String,required:true},
        updateDate:{type: String},
})

const ClientModel=mongoose.model('clientinformation',clientInfoSchema)
module.exports=ClientModel