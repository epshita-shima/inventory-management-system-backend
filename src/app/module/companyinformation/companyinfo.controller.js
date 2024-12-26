const companyService = require('./companyinfo.service');

const saveCompany=async(req, res)=> {
  try {
    const { companyName,companyAddress, companyContact,companyEmail,footerAddress,footerContact} = req.body;
    const savedCompany = await companyService.saveCompanyDetails(companyName,companyAddress, companyContact,companyEmail,footerAddress,footerContact);
    res.json(savedCompany);
  } catch (error) {
    console.log('Error saving company details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const  getAllCompanies=async(req, res)=> {
    try {
      const companies = await companyService.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.log('Error fetching companies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
module.exports = { saveCompany,getAllCompanies };