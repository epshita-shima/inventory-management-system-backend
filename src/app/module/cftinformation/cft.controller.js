const CFTInfosService = require("./cft.service");
const CFTInfoModel = require("./cft.model");
var fs = require("fs");
const getCFTInfoController = async (req, res, next) => {
  const data = req.body;
  console.log(data);
  const CFTInfoData = await CFTInfosService.getCFTInfosDB(data);
  res.json(CFTInfoData);
};

const insertCFTInfoController = async (req, res, next) => {
  try {
    const datas = Array.isArray(req.body) ? req.body[0] : req.body;
    const { makeBy, makeDate, updateBy, updateDate, detailsData } = datas;
    console.log(makeBy, makeDate, updateBy, updateDate, detailsData);
    console.log("req.files:", req.files);

    let detailsDatas = datas.detailsData.map((detail, index) => {
      const image = req.files && req.files[index] ? req.files[index].path : "";
      return {
        itemId: detail.itemId,
        cftPerKg: detail.cftPerKg,
        image: image,
      };
    });
    const newImage = new CFTInfoModel({
      openingDate: datas.openingDate,
      detailsData: detailsDatas,
      isActive: datas.isActive,
      closingDate: datas.closingDate,
      makeBy: datas.makeBy,
      makeDate: datas.makeDate,
      updateBy: datas.updateBy,
      updateDate: datas.updateDate,
    });

    console.log("newImage", newImage);
    const CFTInfo = await CFTInfosService.insertCFTInfosDB(newImage);
    res.status(200).json({
      status: "success",
      data: CFTInfo,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: { error },
    });
  }
};

const getCFTInfoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const singleICFTInfo = await CFTInfosService.getCFTInfosByIdDB(id);
    if (!singleICFTInfo) {
      return res.status(404).json({ message: "Menu not found" });
    }
    return res.status(200).json(singleICFTInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCFTInfoController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("update req body",req.body,req.files)
    const detailsDatas = req.body.detailsData.map((detail, index) => {
      const dynamicFieldName = `detailsData[${index}][image]`;
      const newFile = req.files.find(file => file.fieldname === dynamicFieldName); // Find the specific file to update
console.log('newfile',newFile)
      // Check if the current detail's image field is empty
      if (newFile) {
        detail.image = newFile.path; // Set the new file path to the image field
      } else {
        console.error('Expected a File object but got:', newFile);
      }

      return {
        itemId: detail.itemId,
        cftPerKg: detail.cftPerKg,
        image: detail.image, // Updated image field
      };
    });
    
    const updateCFTInfoData = {
      openingDate: req.body.openingDate,
      detailsData: detailsDatas,
      isActive: req.body.isActive,
      closingDate: req.body.closingDate,
      makeBy: req.body.makeBy,
      makeDate: req.body.makeDate,
      updateBy: req.body.updateBy,
      updateDate: req.body.updateDate,
    };

  
console.log('updateCFTInfoData',updateCFTInfoData)
    const result = await CFTInfosService.updateCFTInfosDB(
      id,
      updateCFTInfoData
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCFTInfoStatusController = async (req, res) => {
  try {
    const result = await CFTInfosService.updateCFTInfosStatusDB(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCFTInfoController = async (req, res) => {
  const { id } = req.params;
  try {
    const cftInfo = await CFTInfosService.deleteCFTInfosDB(id);
    return res.status(200).json(cftInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCFTInfoController,
  insertCFTInfoController,
  updateCFTInfoController,
  getCFTInfoByIdController,
  updateCFTInfoStatusController,
  deleteCFTInfoController,
};
