const mongoose = require("mongoose");

const dropdownSchema = new mongoose.Schema({
  id:{ type: String, required: true },
  label: { type: String, required: true },
  url: { type: String, required: true },
  isChecked: { type: Boolean, default: false },
  items: [this],
  parentIds: [{ type: String }],
  trackId: { type: String, required: true },
  isInserted: { type: Boolean, default: false},
  isUpdated: { type: Boolean, default: false },
  isRemoved: { type: Boolean, default: false },
  isPDF: { type: Boolean, default: false },
  isParent:{ type: Boolean, required: true }
});

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  mobileNo: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String},
  hashPassword: { type: String},
  isactive: { type: Boolean, required: true },
  roleId: { type: String, required: true },
  menulist: [
    {
      id:{ type: String ,required:true},
      trackId: { type: String },
      label: { type: String, required: true },
      url: { type: String, required: true },
      items: [dropdownSchema],
      isChecked: { type: Boolean, default: false },
      isInserted: { type: Boolean, default: false },
      isUpdated: { type: Boolean, default: false },
      isRemoved: { type: Boolean, default: false },
      isPDF: { type: Boolean, default: false },
      isParent:{ type: Boolean, required: true }
    },
  ],
  makeby: { type: String },
  updateby: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
