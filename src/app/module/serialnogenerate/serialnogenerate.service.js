const SerialNoGenerate = require("./serialnogenerate.model");

async function getNextSerialNumber(type) {
  const result = await SerialNoGenerate.findOneAndUpdate(
    { type },
    { $inc: { serialNo: 1 } },
    { new: true, upsert: true }
  );
  return result.serialNo;
}

const getSerialNoDB = async () => {
  try {
    const serialNo = await SerialNoGenerate.find().select({
      __v: 0,
    });
    return serialNo;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const getDoShipmentNoDB = async () => {
    const result = await SerialNoGenerate.findOneAndUpdate(
        { piNumber },
        { $inc: { shipmentNo: 1 } },
        { new: true, upsert: true }
      );
      return result.shipmentNo;
};


module.exports = { getNextSerialNumber, getSerialNoDB, getDoShipmentNoDB };
