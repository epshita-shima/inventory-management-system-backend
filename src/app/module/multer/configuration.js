const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    console.log('filename',req.body)
    let ext = path.extname(file.originalname);
    let basename = path.basename(file.originalname, ext);
    cb(null, Date.now() + basename + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    console.log('upload',req.body)
    // const data = JSON.parse(JSON.stringify(req.body));
    // req.body = data;
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
      callback(null, true);
    } else {
      console.log("only jpg and png file supported!");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});
  
const dynamicFields = (req, res, next) => {
  console.log(req.body);
  
  upload.any()(req, res, (err) => {
    if (err) {
      return next(err);
    }
    // Parse and process req.body here after files are handled
    try {
      console.log('dynamic data',req.body,req.files)
      const data = JSON.parse(JSON.stringify(req.body));  
      req.body = data;
      next();
    } catch (parseError) {
      return next(parseError);
    }
  });
};

  
module.exports = dynamicFields;
