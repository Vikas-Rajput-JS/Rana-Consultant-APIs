var express = require("express");
const VerifyUser = require("./../MiddleWare/VerifyUser");
var Router = express.Router();
const path = require("path");
const Users = require("./../Models/Users");
const multer = require("multer");
const { error } = require("console");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/data/uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const fileFilter = function (req, file, cb) {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("File format not supported"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

Router.post("/imageUpload", upload.single("file"), async (req, res, next) => {

  try {
    if (!req?.file) {
      res?.status(400).send({
        success: false,
        status: 400,
        message: "Please provide valid file",
      });
    }
    res.status(200).send({success:true,status:200,data:{path:req.file.filename,fullPath:`images/modal=user/${req.file?.filename}`}})
  } catch (error) {
    console.log(error)
    next(error);
  }
});

Router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});
module.exports = Router;
