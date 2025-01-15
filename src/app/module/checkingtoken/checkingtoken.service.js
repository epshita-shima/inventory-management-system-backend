const jwt=require('jsonwebtoken');
const cookie=require('cookie-parser')
const generateToken=(payload)=>{
  return jwt.sign(payload,process.env.JWT_TOKEN,{expiresIn:'1h'})
};

const userLogin= async (req, res, next) => {
    try {
      const data = req.body;
      console.log(data)
      const token=jwt.sign(data,process.env.ACCESS_SECRET_TOKEN,{expiresIn:'1h'});
  
      res.cookie('token',token,{
        httpOnly:true,
        secure:false
      })
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to save data to the database",
      });
    }
  };

  module.exports ={userLogin}