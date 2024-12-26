const GoodsReceiveNoteService = require("./grninfo.service");

const getGoodsReceiveNoteInfoController = async (req, res, next) => {
  const data = req.body;
  const grnInfoData = await GoodsReceiveNoteService.getGoodsReceiveNoteInfoDB(
    data
  );
  res.json(grnInfoData);
};
const getFilteredGoodsReceiveNoteInfoController = async (req, res, next) => {
  const { supplierPONo, supplierId, fromDate, toDate, selectMonth } = req.query;

  const filteredGoodsReceiveNotes =
    await GoodsReceiveNoteService.getFilteredGRNDataInformationDB(
      supplierPONo,
      supplierId,
      fromDate,
      toDate,
      selectMonth
    );
  res.json(filteredGoodsReceiveNotes);
};

async function insertGoodsReceiveNoteInfoController(req, res) {
  try {
    const insertedGRN =
      await GoodsReceiveNoteService.insertGoodsReceiveNoteInfoDB(req.body);
    res.status(200).json(insertedGRN);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getGoodsReceiveNoteInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleGRNInfo =
      await GoodsReceiveNoteService.getGoodsReceiveNoteInfoByIdDB(id);
    if (!singleGRNInfo) {
      return res.status(404).json({ message: "GRN info not found" });
    }
    return res.status(200).json(singleGRNInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateGoodsReceiveNoteInfoController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGRNData = req.body;
    const result = await GoodsReceiveNoteService.updateGoodsReceiveNoteInfoDB(
      id,
      updatedGRNData
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGoodsReceiveNoteInfoController = async (req, res) => {
  const { id } = req.params;
  try {
    const grnInfo = await GoodsReceiveNoteService.deleteGoodsReceiveNoteInfoDB(
      id
    );
    return res.status(200).json(grnInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getGoodsReceiveNoteInfoController,
  getFilteredGoodsReceiveNoteInfoController,
  insertGoodsReceiveNoteInfoController,
  getGoodsReceiveNoteInfoByIdController,
  updateGoodsReceiveNoteInfoController,
  deleteGoodsReceiveNoteInfoController,
};
