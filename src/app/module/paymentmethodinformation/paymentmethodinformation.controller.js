const PaymentMethodInfoService = require("./paymentmethodinformation.service");

async function getPaymentMethodInfoController(req, res, next) {
  const data = req.body;
  const paymentMethodInfoData =
    await PaymentMethodInfoService.getPaymentMethodInfoDB(data);
  res.json(paymentMethodInfoData);
}

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
const updatePaymentMethodInfoController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updatePaymentMethodInfo = req.body; // Assuming the updated data is sent in the request body
    console.log("updatedData", updatePaymentMethodInfo);
    const result = await PaymentMethodInfoService.updatePaymentMethodInfoDB(
      id,
      updatePaymentMethodInfo
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePaymentMethodInfoController = async (req, res) => {
  const { id } = req.params;
  try {
    const paymentMethodInfo =
      await PaymentMethodInfoService.deletePaymentMethodInfoDB(id);
    return res.status(200).json(paymentMethodInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getPaymentMethodInfoController,
  insertPaymentMethodInfoController,
  getPaymentMethodInfoByIdController,
  updatePaymentMethodInfoController,
  deletePaymentMethodInfoController,
};
