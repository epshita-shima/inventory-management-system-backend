const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const verifyToken = require("../../middlewares/verifyToken");

router.post("/", userController.createUser);
router.get("/me", verifyToken, userController.getCurrentUser);
router.get('/',userController.getUser);
router.get('/:id',userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.put('/updateinfo/:id', userController.updateUserInformationController);
router.put('/change/password/:id', userController.updateUserPassword);
router.delete('/delete/:id',userController.deleteUser);
router.put('/status/updateStatus',userController.updateUserMultipleStatus);
router.put('/updatestatus/updateMultiple',userController.updateUserMultipleField);

module.exports = router;
