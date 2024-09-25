const PaymentMethodInfoService = require("./paymentmethodinformation.service");

async function getPaymentMethodInfoController(req, res, next) {
  const data = req.body;
  const paymentMethodInfoData =
    await PaymentMethodInfoService.getPaymentMethodInfoDB(data);
  res.json(paymentMethodInfoData);
}

const getFilteredPaymentMethodInfoController = async (req, res, next) => {
  console.log(req.query)
  const { customerID, invoiceNo } = req.query;
  const filteredPaymentReceive =
    await PaymentMethodInfoService.getFilteredPaymentMethodInfoDB(
      clientId,
      piNumber
    );
  res.json(filteredPaymentReceive);
};

async function insertPaymentMethodInfoController(req, res) {
  try {
    const insertedPaymentMethod =
      await PaymentMethodInfoService.insertPaymentMethodInfoDB(req.body);
    res.status(200).json(insertedPaymentMethod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getPaymentMethodInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singlePaymentMethodInfo =
      await PaymentMethodInfoService.getPaymentMethodInfoByIdDB(id);
    if (!singlePaymentMethodInfo) {
      return res.status(404).json({ message: "Payment method info not found" });
    }
    return res.status(200).json(singlePaymentMethodInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updatePreviousPaymentMethodInfoController = async (req, res) => {
  try {
    const updatePaymentMethodInfo = req.body; // Assuming the updated data is sent in the request body
    console.log("updatedData", updatePaymentMethodInfo);
    const result =
      await PaymentMethodInfoService.updatePreviousPaymentMethodInfoDB(
        updatePaymentMethodInfo
      );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePaymentMethodInfoController = async (req, res) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ message: "Invalid data provided" });
  }
  try {
    const paymentMethodInfo =
      await PaymentMethodInfoService.deletePaymentMethodInfoDB(data);
      console.log('paymentMethodInfo',paymentMethodInfo)
    return res.status(200).json(paymentMethodInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getPaymentMethodInfoController,
  getFilteredPaymentMethodInfoController,
  insertPaymentMethodInfoController,
  getPaymentMethodInfoByIdController,
  updatePreviousPaymentMethodInfoController,
  deletePaymentMethodInfoController,
};
