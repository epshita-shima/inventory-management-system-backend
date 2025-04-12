const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  label: { type: String, required: true },
  url: { type: String, required: true },
  permissions: [{ type: String, required: true }],
  trackId: { type: String },
  items: [this],
  isParent: { type: Boolean, required: true },
  isChecked: { type: Boolean ,required: true},
  isInserted: { type: Boolean ,required: true},
  isRemoved: { type: Boolean ,required: true},
  isUpdated: { type: Boolean ,required: true},
  isPDF: { type: Boolean ,required: true},
});

const menuItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  permissions: [{ type: String, required: true }],
  items: [itemSchema],
  isParent: { type: Boolean, required: true },
  isChecked: { type: Boolean ,required: true},
  isInserted: { type: Boolean ,required: true},
  isRemoved: { type: Boolean ,required: true},
  isUpdated: { type: Boolean ,required: true},
  isPDF: { type: Boolean ,required: true},
  order:{ type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  trackId: { type: String },
});
const Item = mongoose.model("Item", itemSchema);
const MenuItem = mongoose.model("menu", menuItemSchema);
module.exports = { MenuItem, Item };
