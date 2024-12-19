const express = require('express');
const router = express.Router();
const companyService = require('./companyinfo.controller');

router.post('/',companyService.saveCompany);
router.get('/', companyService.getAllCompanies);
module.exports = router;