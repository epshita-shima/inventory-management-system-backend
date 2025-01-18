const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const UserModel = require("../user/user.model");
const userLogin = async (req, res, next) => {
  try {
    const userInfo = await UserModel.find();
    const data = req.body;
    const singleUser = userInfo?.find((item) => item.username === data.username);
    console.log(
      "singleUser.username =",
      singleUser.username,
      "data.username=",
      data.username,
      "singleUser.password=",
      singleUser.password,
      "data.password=",
      data.password
    );
    if (
      singleUser.username == data.username &&
      singleUser.password == data.password
    ) {
      const token = jwt.sign(data, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: "1h",
      });
      res.cookie("cookie", token, {
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({
        data: singleUser,
        success: true,
        message: "Login successful",
        token: token,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Login Faild",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to Login",
    });
  }
};

const userLogout = (req, res) => {
  res.cookie("cookie", "", {
    httpOnly: true,
    secure: false,
    samesite: "lax",
    path: "/",
    expires: new Date(0),
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = { userLogin, userLogout };
