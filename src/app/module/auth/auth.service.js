const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const UserModel = require("../user/user.model");
const blacklist = require("./blacklistToken");
const crypto = require("crypto-browserify");

// const userLogin = async (req, res, next) => {
//   // const randomBytes = crypto.randomBytes(64).toString('hex');
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and password are required",
//       });
//     }
//     // const alluser=await UserModel.find()
//     // fs.writeFileSync("UserModel.json", JSON.stringify(alluser, null, 2));
//     // console.log("Data exported successfully!");

//     const singleUser = await UserModel.findOne({ username, password });

//     if (!singleUser) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid username or password" });
//     }

//     const userTokenCreationPayload = {
//       username: singleUser.username,
//       password: singleUser.password,
//       userRole: singleUser.roleId,
//       isActive: singleUser.isactive,
//     };
//     const accesstoken = jwt.sign(
//       userTokenCreationPayload,
//       process.env.ACCESS_SECRET_TOKEN,
//       {
//         expiresIn: "10m",
//       }
//     );

//     const refreshToken = jwt.sign(
//       userTokenCreationPayload,
//       process.env.REFRESH_SECRET_TOKEN,
//       {
//         expiresIn: "24hr",
//       }
//     );

//     res.cookie("cookie", refreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//       maxAge: 3600000,
//     });

//     res.status(200).json({
//       data: singleUser,
//       success: true,
//       message: "Login successful",
//       token: accesstoken,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to Login",
//     });
//   }
// };

const userLogin = async (req, res, next) => {
  try {
    console.time("Total Execution Time");

    console.time("Extracting Request Data");
    const { username, password } = req.body; 
    console.log('username password', username, password);
    console.timeEnd("Extracting Request Data");

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    console.time("Finding User in Database");
    
    const singleUser = await UserModel.findOne({ username })
      .select("username password firstname lastname menulist")
      .lean();
    console.timeEnd("Finding User in Database");

    if (!singleUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }


    console.time("Sorting Menu List");
    if (singleUser.menulist && singleUser.menulist.length > 0) {
  
      singleUser.menulist.sort((a, b) => {
        const orderA = parseInt(a.orderNo || "999");
        const orderB = parseInt(b.orderNo || "999");
        return orderA - orderB;
      });
    }
    console.timeEnd("Sorting Menu List");

    const userTokenCreationPayload = {
      username: singleUser.username,
      password: singleUser.password,
      userRole: singleUser.roleId,
      isActive: singleUser.isactive,
    };

    console.time("Generating Access Token");
    const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;
    const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;
    const accesstoken = jwt.sign(
      userTokenCreationPayload,
      ACCESS_SECRET_TOKEN,
      {
        expiresIn: "10m",
      }
    );
    console.timeEnd("Generating Access Token");

    console.time("Generating Refresh Token");
    const refreshToken = jwt.sign(
      userTokenCreationPayload,
      REFRESH_SECRET_TOKEN,
      {
        expiresIn: "24h",
      }
    );
    console.timeEnd("Generating Refresh Token");

    console.time("Setting Cookie");
    res.cookie("cookie", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });
    console.timeEnd("Setting Cookie");

    console.timeEnd("Total Execution Time");

    res.status(200).json({
      data: singleUser,
      success: true,
      message: "Login successful",
      token: accesstoken,
    });
  } catch (error) {
    console.error("Login Error:", error);
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
    } else {
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
  if (!token) {
    res.status(401).json({
      success: true,
      message: "Logged out successfully",
    });
  } else {
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
