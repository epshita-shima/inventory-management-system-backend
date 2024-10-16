const SerialNoGenerate = require("./serialnogenerate.model");
const { getNextSerialNumber, getSerialNoDB,getDoShipmentNoDB } = require("./serialnogenerate.service");

async function insertDocument(documentData) {
    console.log(documentData.type)
    const serialNo = await getNextSerialNumber(documentData.type);
    const document = new SerialNoGenerate({
      ...documentData,
      serialNo
    });
    return document.save();
}

async function insertDoDocumentController(documentData) {
    console.log(documentData.piNumber)
    const shipmentNo = await getDoShipmentNoDB(documentData.piNumber);
    const document = new SerialNoGenerate({
      ...documentData,
      shipmentNo
    });
    return document.save();
}

const getSerialNumber=async(req,res,next)=>{
    const data = req.body;
    const serialNo = await getSerialNoDB(data)
    res.json(serialNo);
}

module.exports = { insertDocument,getSerialNumber,insertDoDocumentController};