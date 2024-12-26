const FinishGoodIteminfoService = require("./finishgoods.service");

const getItemInfoController = async (req, res, next) => {
  const data = req.body;
  const itemInfoData = await FinishGoodIteminfoService.getItemInfoDB(data);
  res.json(itemInfoData);
};

const insertItemInfoController = async (req, res, next) => {
  try {
    const data = req.body;
    const itemInfo = await FinishGoodIteminfoService.insertItemInfotDB(data);
    res.status(200).json({
      status: "success",
      data: itemInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getItemInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleItemInfo = await FinishGoodIteminfoService.getItemInfoByIdDB(id);
    if (!singleItemInfo) {
      return res.status(404).json({ message: "Menu not found" });
    }
    return res.status(200).json(singleItemInfo);
  } catch (error) {
   console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateItemInformationController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItemData = req.body; 
    const result = await FinishGoodIteminfoService.updateItemInformationDB(
      id,
      updatedItemData
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItemInformationStatusController = async (req, res) => {
  try {
      const result = await FinishGoodIteminfoService.updateItemInformationStatusDB(req.body);
      return res.status(200).json(result);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteItemInformationController = async (req, res) => {
  const { id } = req.params;
  try {
      const itemInfo = await FinishGoodIteminfoService.deleteItemInformationDB(id);
      return res.status(200).json(itemInfo);
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  getItemInfoController,
  insertItemInfoController,
  getItemInfoByIdController,
  updateItemInformationController,
  updateItemInformationStatusController,
  deleteItemInformationController
};
