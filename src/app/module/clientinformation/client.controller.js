const ClientInfoService=require('./client.service')

const getClientInfoController = async (req, res, next) => {
    const data = req.body;
    console.log('req.query',req.query)
    console.log('from valid token',req.loginUser)
    // console.log('client cookies',req.cookies)
    const clientInfoData = await ClientInfoService.getClientInfoDB(data);
    res.json(clientInfoData);
  };

const insertClientInfoController = async (req, res, next) => {
    try {
      const data = req.body;
      const clientInfo = await ClientInfoService.insertClientInfoDB(data);
      res.status(200).json({
        status: "success",
        data: clientInfo,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to save data to the database",
      });
    }
  };

  const getClientInfoByIdController = async (req, res) => {
    const { id } = req.params;
    try {
      const singleClientInfo = await ClientInfoService.getClientInfoByIdDB(id);
      if (!singleClientInfo ) {
        return res.status(404).json({ message: "Supplier info not found" });
      }
      return res.status(200).json( singleClientInfo );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const updateClientInformationController = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const updatedClientData = req.body; // Assuming the updated data is sent in the request body
      console.log("updatedClientData", updatedClientData);
      const result = await ClientInfoService.updateClientInformationDB(
        id,
        updatedClientData
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updateClientInformationStatusController = async (req, res) => {
    try {
        const result = await ClientInfoService.updateClientInformationStatusDB(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const deleteClientInformationController = async (req, res) => {
    const { id } = req.params;
    try {
        const clientInfo = await ClientInfoService.deleteClientInformationDB(id);
        return res.status(200).json(clientInfo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = {getClientInfoController,insertClientInfoController,getClientInfoByIdController,updateClientInformationController,updateClientInformationStatusController,deleteClientInformationController}