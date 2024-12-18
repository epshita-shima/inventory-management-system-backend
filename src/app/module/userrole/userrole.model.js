const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
    userrolename: { type: String, required: true },
    makeby:{ type: String },
    updateby:{ type: String},
}, { timestamps: true });

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;



// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const userRoleSchema = new mongoose.Schema({
//     userrollname: String
//   }, { timestamps: true });

  
//   module.exports=mongoose.model('UserRoles', userRoleSchema)

