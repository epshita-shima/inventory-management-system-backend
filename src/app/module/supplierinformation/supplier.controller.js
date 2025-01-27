const SupplierInfoService = require("./supplier.service");

const getSupplierInfoController = async (req, res, next) => {
  const data = req.body;
  const supplierInfoData = await SupplierInfoService.getSupplierInfoDB(data);
  res.json(supplierInfoData);
};

const insertSupplierInfoController = async (req, res, next) => {
  try {
    const data = req.body;
    const CFTInfo = await SupplierInfoService.insertSupplierInfoDB(data);
    res.status(200).json({
      status: "success",
      data: CFTInfo,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to save data to the database",
    });
  }
};

const getSupplierInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleSupplierInfo = await SupplierInfoService.getAupplierInfoByIdDB(
      id
    );
    if (!singleSupplierInfo) {
      return res.status(404).json({ message: "Supplier info not found" });
    }
    return res.status(200).json(singleSupplierInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateSupplierInformationController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSupplierData = req.body;
    const result = await SupplierInfoService.updateSupplierInformationDB(
      id,
      updatedSupplierData
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSupplierInformationStatusController = async (req, res) => {
  try {
    const result = await SupplierInfoService.updateSupplierInformationStatusDB(
      req.body
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSupplierInformationController = async (req, res) => {
  const { id } = req.params;
  try {
    const supplierInfo = await SupplierInfoService.deleteSupplierInformationDB(
      id
    );
    return res.status(200).json(supplierInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getSupplierInfoController,
  insertSupplierInfoController,
  getSupplierInfoByIdController,
  updateSupplierInformationController,
  updateSupplierInformationStatusController,
  deleteSupplierInformationController,
};
