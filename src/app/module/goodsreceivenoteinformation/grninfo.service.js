const GoodsReceiveNoteInfoModel = require("./grninfo.model");
const PurchaseOrderInfoModel = require("../purchaseorderinformation/purchaseorderinfo.model");

async function getGoodsReceiveNoteInfoDB() {
  try {
    const grnInfo = await GoodsReceiveNoteInfoModel.find();
    return grnInfo;
  } catch (error) {
    console.log("Error fetching item size:", error);
  }
}

async function insertGoodsReceiveNoteInfoDB(grnInfo) {
  try {
    return await GoodsReceiveNoteInfoModel.insertMany(grnInfo);
  } catch (error) {
    throw new Error("Error inserting grn info: " + error.message);
  }
}

async function getGoodsReceiveNoteInfoByIdDB(id) {
  try {
    const singleGRNInfo = await GoodsReceiveNoteInfoModel.findById(id);
    return singleGRNInfo;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error from service");
  }
}

async function getFilteredGRNDataInformationDB(
  supplierPONo,
  supplierId,
  fromDate,
  toDate,
  selectMonth
) {
  try {
    const filter = {};

    if (supplierPONo) {
      filter.supplierPoNo = supplierPONo;
    } else if (supplierId) {
      filter.supplierId = supplierId;
    } else if (fromDate && toDate) {
      filter.receiveDate = { $gte: fromDate, $lte: toDate };
    } else if (selectMonth) {
      let dateRanges = [];
      try {
        dateRanges = JSON.parse(selectMonth).map((month) => ({
          start: month.start,
          end: month.end,
        }));
      } catch (error) {
        console.log("Error parsing selectMonth:", error);
        throw new Error("Invalid selectMonth format");
      }
      filter.$or = dateRanges.map((range) => ({
        receiveDate: { $gte: range.start, $lte: range.end },
      }));
    }

    if (Object.keys(filter).length === 0 && filter.constructor === Object) {
      return []; 
    } else {
      const data = await GoodsReceiveNoteInfoModel.find(filter);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateGoodsReceiveNoteInfoDB(id, data) {
  try {
    const updateGRNInfo = await GoodsReceiveNoteInfoModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (updateGRNInfo) {
      return updateGRNInfo;
    } else {
     console.log("No matching document found for ID:", id);
      return null;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error from service");
  }
}
const deleteGoodsReceiveNoteInfoDB = async (id) => {
  try {
    const deleteGRNInfoData = await GoodsReceiveNoteInfoModel.findByIdAndDelete(
      id
    );
    if (!deleteGRNInfoData) {
      throw new Error("GRN info not found");
    }
    return deleteGRNInfoData;
  } catch (error) {
    throw new Error("Internal server error");
  }
};
module.exports = {
  getGoodsReceiveNoteInfoDB,
  getFilteredGRNDataInformationDB,
  insertGoodsReceiveNoteInfoDB,
  getGoodsReceiveNoteInfoByIdDB,
  updateGoodsReceiveNoteInfoDB,
  deleteGoodsReceiveNoteInfoDB,
};
