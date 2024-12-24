const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dynamicFields = require("./app/module/multer/configuration");
require("dotenv").config();
const  globalErrorHandler  = require("./app/middlewares/globalErrorHandler");
const app = express();
const routes=require('./app/routes')
const cookieParser =require('cookie-parser');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

app.use(dynamicFields);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/',async(req,res,next)=>{
  Promise.reject(new Error('Unhandled promise rejection'))
})
// app.get('/',async(req,res,next)=>{
//   console.log(x)
// })
app.use(globalErrorHandler);

module.exports=app