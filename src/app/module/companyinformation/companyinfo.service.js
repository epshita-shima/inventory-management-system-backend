const Company = require('./companyinfo.model');

const saveCompanyDetails=async (companyName,companyAddress, companyContact,companyEmail,footerAddress,footerContact)=> {
  try {
    const company = new Company({
        companyName,companyAddress, companyContact,companyEmail,footerAddress,footerContact
    });
    const savedCompany = await company.save();
    return savedCompany;
  } catch (error) {
    throw error;
  }
}

const getAllCompanies=async()=> {
    try {
      const companies = await Company.find();
      return companies;
    } catch (error) {
      throw error;
    }
  }

module.exports = { saveCompanyDetails,getAllCompanies };