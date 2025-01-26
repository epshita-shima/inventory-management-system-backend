const SalesManagementService = require("./salesmanagementinfo.service");

async function getInvoiceInformationController(req, res, next) {
  const data = req.body;
  console.log('get data from invoice',req.body)
  const invoiceData = await SalesManagementService.getInvoiceInformationDB(
    data
  );
  res.json(invoiceData);
}

async function insertInvoiceInformationController(req, res,next) {
  try {
    const insertedInvoice =
      await SalesManagementService.insertInvoiceInformationDB(req.body);
    res.status(200).json(insertedInvoice);
  } catch (error) {
    next(error)
  }
}

const getFilteredInvoiceInfoController = async (req, res) => {
  const { customerID,piNumber } = req.query;
  try {
    const filteredData = await SalesManagementService.getFilteredInvoiceInfoDB(customerID,piNumber);
    res.json(filteredData);
  } catch (error) {
    console.log('Error in controller:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};

const getInvoiceInformationByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleInvoiceInfo =
      await SalesManagementService.getInvoiceInformationByIdDB(id);
    if (!singleInvoiceInfo) {
      return res.status(404).json({ message: "Production info not found" });
    }
    return res.status(200).json(singleInvoiceInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateInvoiceSpecialPIApproveController = async (req, res) => {
  try {
      const result = await SalesManagementService.updateSpecialInvoiceApproveDB(req.body);
      return res.status(200).json(result);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const updateInvoiceShipmentNoController = async (req, res) => {
  try {
      const result = await SalesManagementService.updateInvoiceShipmentNoDB(req.body);
      return res.status(200).json(result);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const updateInvoiceInformationController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateInvoiceData = req.body; 
    const result = await SalesManagementService.updateInvoiceInformationDB(
      id,
      updateInvoiceData
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInvoiceStatusController = async (req, res) => {
  try {
      const result = await SalesManagementService.updateInvoicePIStatusDB(req.body);
      return res.status(200).json(result);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteInvoiceInformationController = async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceInfo = await SalesManagementService.deleteInvoiceInformationDB(
      id
    );
    return res.status(200).json(invoiceInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getInvoiceInformationController,
  insertInvoiceInformationController,
  getFilteredInvoiceInfoController,
  getInvoiceInformationByIdController,
  updateInvoiceInformationController,
  updateInvoiceStatusController,
  updateInvoiceSpecialPIApproveController,
  updateInvoiceShipmentNoController,
  deleteInvoiceInformationController,
};
