const jwt = require("jsonwebtoken");
const blacklist = require("../module/auth/blacklistToken");

const verifyToken=async(req,res,next)=>{
  const token=req.headers['authorization']?.split(' ')[1]
  console.log('cookie',req)
  const refreshToken=req.cookies.cookie
console.log('token',token)
console.log(refreshToken)
  if(!token || !refreshToken){
    return res.status(401).json({message:'not authorizd'})
  }

  if (blacklist.includes(refreshToken)) {
    return res.status(401).json({ message: "Token is invalid" });
  }

  jwt.verify(token,process.env.ACCESS_SECRET_TOKEN,(err,decoded)=>{
   
    if(err){
      return res.status(401).json({message:'unauthorized'})
    }
    req.loginUser=decoded
    next()
  })
}

module.exports = verifyToken