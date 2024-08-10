const CFTInfosService = require("./cft.service");
const CFTInfoModel=require('./cft.model')
var fs = require("fs");
const getCFTInfoController = async (req, res, next) => {
  const data = req.body;
  console.log(data)
  const CFTInfoData = await CFTInfosService.getCFTInfosDB(data);
  res.json(CFTInfoData);
};

const insertCFTInfoController = async (req, res, next) => {

  try {
    const data = Array.isArray(req.body) ? req.body[0] : req.body;

    const { makeBy, makeDate, updateBy, updateDate, detailsData } = data;
  
    console.log(makeBy, makeDate, updateBy, updateDate, detailsData);
    console.log('req.files:', req.files);

    // const data = req.body;
    // const files = req.files;

    // const detailsData = JSON.parse(data.detailsData).map((detail, index) => ({
    //   itemId: detail.itemId,
    //   openingDate: detail.openingDate,
    //   cftPerKg: detail.cftPerKg,
    //   image: files[`detailsData[${index}][image]`] ? files[`detailsData[${index}][image]`][0].path : detail.image || '',
    //   isActive: detail.isActive,
    //   closingDate: detail.closingDate
    // }));

    // const newImage = new CFTInfoModel({
    //   detailsData: detailsData,
    //   makeBy: data.makeBy,
    //   makeDate: data.makeDate,
    //   updateBy: data.updateBy,
    //   updateDate: data.updateDate
    // });


    // const CFTInfo = await CFTInfosService.insertCFTInfosDB(newImage);
    // res.status(200).json({
    //     status: "success",
    //     data: CFTInfo,
    // });
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
    const updateCFTInfoData = {
      openingDate: req.body.openingDate,
      kgPerUnit: req.body.kgPerUnit,
      isActive: req.body.isActive ,
      closingDate: req.body.closingDate,
      makeBy: req.body.makeBy,
      makeDate: req.body.makeDate,
      updateBy: req.body.updateBy,
      updateDate: req.body.updateDate,
  };

  if (req.file) {
      updateCFTInfoData.image = req.file.path; // Update image if a new file is uploaded
  }

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
        return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
module.exports = {
  getCFTInfoController,
  insertCFTInfoController,
  updateCFTInfoController,
  getCFTInfoByIdController,
  updateCFTInfoStatusController,
  deleteCFTInfoController
};
