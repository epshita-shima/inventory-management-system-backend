const loggerTestMiddleware=async(req,res,next)=>{
  // console.log('called',req.host,req.originalUrl)
  next()
}
module.exports = loggerTestMiddleware;