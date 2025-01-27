const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dynamicFields = require("./app/module/multer/configuration");
require("dotenv").config();
const  globalErrorHandler  = require("./app/middlewares/globalErrorHandler");
const app = express();
const routes=require('./app/routes')
const cookieParser =require('cookie-parser');
const verifyToken=require('./app/middlewares/verifyToken')
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

app.use(dynamicFields);

// app.use(cors({ origin: 'https://steady-starlight-5941ea.netlify.app', credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', async (req, res, next) => {
//     try {
//         await Promise.reject(new Error('Handled promise rejection'));
//     } catch (error) {
//         next(error); 
//     }
// });

app.get('/', (req, res) => {
  res.send('Running inventory management');
});

app.use('/api/v2',routes)
app.use('/api/v1',verifyToken, routes);

app.use(globalErrorHandler);

module.exports=app