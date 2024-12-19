const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  companyContact: { type: String, required: true },
  companyEmail: { type: String, required: true },
  footerAddress: { type: String, required: true },
  footerContact: { type: String, required: true }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;