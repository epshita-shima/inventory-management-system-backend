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
      return res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required",
        });
    }

    const singleUser = await UserModel.findOne({ username });
    if (!singleUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    const userTokenCreationPayload = {
      username: singleUser.username,
      userRole: singleUser.roleId,
      isActive: singleUser.isactive,
    };
    const accesstoken = jwt.sign(
      userTokenCreationPayload,
      process.env.ACCESS_SECRET_TOKEN,
      {
        expiresIn: "1m",
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
      secure: process.env.NODE_ENV === "production",
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
    console.log("hit refresh");
    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
        async (err, decoded) => {
          console.log("refresh", decoded);
          if (err) {
            return res.status(401).json({ message: "unauthorized" });
          } else {
            const user = await UserModel.findOne({
              username: decoded.username,
            });
            console.log('user',user)
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
            console.log(accessNewtoken);
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

module.exports = { userLogin, userLogout, refreshAccessToken };
