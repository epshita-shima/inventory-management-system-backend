const jwt = require("jsonwebtoken");
const blacklist = require("../module/auth/blacklistToken");

const verifyToken=async(req,res,next)=>{
  const token=req.headers['authorization']?.split(' ')[1]
  const refreshToken=req.cookies.cookie
  console.log(blacklist)
// console.log(token)
  // const token=req.cookies?.cookie;
  if(!token || !refreshToken){
    return res.status(401).json({message:'not authorizd'})
  }

  if (blacklist.includes(refreshToken)) {
    return res.status(401).json({ message: "Token is invalid" });
  }

  jwt.verify(token,process.env.ACCESS_SECRET_TOKEN,(err,decoded)=>{
    console.log('decoded',decoded)
   
    if(err){
      console.log('err',err)
      // if(err){
      //   res.clearCookie("cookie",  {
      //     httpOnly: true,
      //     secure: false,
      //   });
      // }
      return res.status(401).json({message:'unauthorized'})
    }
    req.loginUser=decoded
    next()
  })
}

module.exports = verifyToken