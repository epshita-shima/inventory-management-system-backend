const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const UserModel = require("../user/user.model");
const blacklist = require("./blacklistToken");

const userLogin = async (req, res, next) => {
  try {
    const data = req.body;
    console.log('data',data)
    const singleUser = await UserModel.find({ username: data.username });
console.log('singleUser',singleUser)
    const userTokenCreationPayload = {
      username: singleUser[0].username,
      password: singleUser[0].password,
      userRole: singleUser[0].roleId,
      isActive: singleUser[0].isactive,
    };
    console.log('userTokenCreationPayload',userTokenCreationPayload)
    if (
      singleUser[0].username == data.username &&
      singleUser[0].password == data.password
    ) {
      console.log('working')
      const accesstoken = jwt.sign(
        userTokenCreationPayload,
        process.env.ACCESS_SECRET_TOKEN,
        {
          expiresIn: "10m",
        }
      );
      const refreshToken = jwt.sign(
        userTokenCreationPayload,
        process.env.REFRESH_SECRET_TOKEN,
        {
          expiresIn: "1hr",
        }
      );
      res.cookie("cookie", refreshToken, {
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({
        data: singleUser[0],
        success: true,
        message: "Login successful",
        token: accesstoken,
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

const refreshAccessToken = async (req, res) => {

  try{
    const refreshToken = req.cookies?.cookie;
    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
        async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "unauthorized" });
          } else {
            const user = await UserModel.findOne({ username: decoded.username });
            if (!user) {
              res.status(404).json({
                success: false,
                message: "User not found",
              });
            }
            const userTokenCreationPayload = {
              username: user[0].username,
              password: user[0].password,
              userRole: user[0].roleId,
              isActive: user[0].isactive,
            };
            const accessNewtoken = jwt.sign(
              userTokenCreationPayload,
              process.env.ACCESS_SECRET_TOKEN,
              {
                expiresIn: "10m",
              }
            );
  
            res.status(200).json({
              data: user[0],
              success: true,
              message: "Access token refreshed successfully",
              token: accessNewtoken,
            });
          }
        }
      );
    }
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to refresh access token",
    });
  }
 
};

const userLogout = (req, res) => {
  const user = req.body;
  const token = req.cookies?.cookie;
  console.log("token logout", token); // Get token from cookie

  if (token) {
    blacklist.push(token);
  }
  res.clearCookie("cookie", {
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = { userLogin, userLogout,refreshAccessToken };
