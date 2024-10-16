const express = require('express');
const router = express.Router();
const serialNoController=require('./serialnogenerate.controller');

router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        const serialNoData = req.body;
        const serialNo = await serialNoController.insertDocument(serialNoData);
        res.status(201).json({ message: 'Serial number inserted successfully', serialNo });
    } catch (error) {
        console.error('Error inserting serial number:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/',serialNoController.getSerialNumber);

module.exports = router;