const DOInfoService = require("./deliveryorderinfo.service");

async function getDOInfoController(req, res, next) {
  const data = req.body;
  const doInfoData = await DOInfoService.getDOInfoDB(data);
  res.json(doInfoData);
}
async function getDOAfterDeliverInfoController(req, res, next) {
  const data = req.body;
  const doInfoData = await DOInfoService.getDOAfterDeliverInfoDB(data);
  res.json(doInfoData);
}

const getFilteredDOApproveInfoController = async (req, res) => {
  console.log("do approve", req.query);
  const { approveStatus } = req.query; // Assuming approveStatus is passed as a query parameter
  try {
    const filteredData = await DOInfoService.getFilteredDOApproveInfoDB(
      approveStatus
    );

    res.json(filteredData);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

async function insertDOInfoController(req, res) {
  try {
    const insertedDOInfo = await DOInfoService.insertDOInfoInfoDB(req.body);
    res.status(200).json(insertedDOInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getDOInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleDOInfo = await DOInfoService.getDOInfoDB(id);
    if (!singleDOInfo) {
      return res.status(404).json({ message: "DO info not found" });
    }
    return res.status(200).json(singleDOInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getDOSingleInfoByIdController = async (req, res) => {
  console.log("single do", req.query);
  const { id } = req.query;
  try {
    const singleDOInfo = await DOInfoService.getDOSingleInfoByIdDB(id);
    if (!singleDOInfo) {
      return res.status(404).json({ message: "DO info not found" });
    }
    return res.status(200).json(singleDOInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateDOApproveStatusController = async (req, res) => {
  try {
    console.log("controller", req.body);
    const result = await DOInfoService.updateDOApproveStatusDB(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateDOStatusController = async (req, res) => {
  try {
    const result = await DOInfoService.updateDOStatusDB(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteDOInfoController = async (req, res) => {
  const { id } = req.params;
  try {
    const doInfo = await DOInfoService.deleteDOInfoDB(id);
    return res.status(200).json(doInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getDOInfoController,
  getDOAfterDeliverInfoController,
  insertDOInfoController,
  getDOInfoByIdController,
  getDOSingleInfoByIdController,
  getFilteredDOApproveInfoController,
  updateDOApproveStatusController,
  updateDOStatusController,
  deleteDOInfoController,
};
