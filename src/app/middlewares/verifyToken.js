const jwt = require("jsonwebtoken");

const verifyToken=async(req,res,next)=>{
  const token=req.cookies?.cookie;
  console.log('value of the token in middleware',token)
  if(!token){
    return res.status(401).json({message:'not authorizd'})
  }
  
  jwt.verify(token,process.env.ACCESS_SECRET_TOKEN,(err,decoded)=>{
    if(err){
      console.log('err',err)
      return res.status(401).json({message:'unauthorized'})
    }
    console.log('value in the token',decoded);
    req.loginUser=decoded
    next()
  })
}

module.exports = verifyToken