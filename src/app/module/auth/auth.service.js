const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const UserModel = require("../user/user.model");
const blacklist = require("./blacklistToken");
const crypto = require("crypto-browserify");

const userLogin = async (req, res, next) => {
  // const randomBytes = crypto.randomBytes(64).toString('hex');
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const singleUser = await UserModel.findOne({ username, password });

    if (!singleUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    const userTokenCreationPayload = {
      username: singleUser.username,
      password: singleUser.password,
      userRole: singleUser.roleId,
      isActive: singleUser.isactive,
    };
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
        expiresIn: "24hr",
      }
    );

    res.cookie("cookie", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      data: singleUser,
      success: true,
      message: "Login successful",
      token: accesstoken,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to Login",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.cookie;
    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
        async (err, decoded) => {
          if (err) {
            res.clearCookie("cookie", {
              httpOnly: true,
              secure: false,
            });
          
            return res.status(401).json({ message: "Unauthorized" });
          } else {
            const user = await UserModel.findOne({
              username: decoded.username,
              password: decoded.password,
            });
            if (!user) {
              res.status(404).json({
                success: false,
                message: "User not found",
              });
            }
            const userTokenCreationPayload = {
              username: user.username,
              password: user.password,
              userRole: user.roleId,
              isActive: user.isactive,
            };
            const accessNewtoken = jwt.sign(
              userTokenCreationPayload,
              process.env.ACCESS_SECRET_TOKEN,
              {
                expiresIn: "10m",
              }
            );
            res.status(200).json({
              data: user,
              success: true,
              message: "Access token refreshed successfully",
              token: accessNewtoken,
            });
          }
        }
      );
    }
    else{
      res.status(500).json({
        status: "error",
        message: "Failed to refresh access token",
      });
    }
  } catch (error) {
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
  if(!token){
    res.status(401).json({
      success: true,
      message: "Logged out successfully",
    });
  }
 else {
    blacklist.push(token);
    res.clearCookie("cookie", {
      httpOnly: true,
      secure: false,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }


};

module.exports = { userLogin, userLogout, refreshAccessToken };
