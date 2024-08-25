const SalesManagementService = require("./salesmanagementinfo.service");

async function getInvoiceInformationController(req, res, next) {
  const data = req.body;
  const invoiceData = await SalesManagementService.getInvoiceInformationDB(
    data
  );
  res.json(invoiceData);
}

async function insertInvoiceInformationController(req, res) {
  try {
    const insertedInvoice =
      await SalesManagementService.insertInvoiceInformationDB(req.body);
    res.status(200).json(insertedInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updateInvoiceInformationController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updateInvoiceData = req.body; // Assuming the updated data is sent in the request body
    console.log("updatedData", updateInvoiceData);
    const result = await SalesManagementService.updateInvoiceInformationDB(
      id,
      updateInvoiceData
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getInvoiceInformationController,
  insertInvoiceInformationController,
  getInvoiceInformationByIdController,
  updateInvoiceInformationController,
  deleteInvoiceInformationController,
};
