const jwt = require("jsonwebtoken");
const blacklist = require("../module/auth/blacklistToken");

const verifyToken=async(req,res,next)=>{
console.log('blacklist',blacklist)
  const token=req.headers['authorization']?.split(' ')[1]
// console.log(token)
  // const token=req.cookies?.cookie;
  if(!token){
    return res.status(401).json({message:'not authorizd'})
  }

  if (blacklist.includes(token)) {
    return res.status(401).json({ message: "Token is invalid" });
  }

  jwt.verify(token,process.env.ACCESS_SECRET_TOKEN,(err,decoded)=>{
    console.log('decoded',decoded)
    console.log('error',err)
   
    if(err){
      console.log('err',err)
      if(err){
        res.clearCookie("cookie",  {
          httpOnly: true,
          secure: false,
        });
      }
      return res.status(401).json({message:'unauthorized'})
    }

    console.log('value in the token',decoded);
    req.loginUser=decoded
    next()
  })
}

module.exports = verifyToken