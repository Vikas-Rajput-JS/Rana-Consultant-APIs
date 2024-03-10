var express = require("express");
const VerifyUser = require("../MiddleWare/VerifyUser");
var Router = express.Router();
const path = require("path");

const Users = require("../Models/Users");
const OTP = require("../Models/Otp");
const Admin = require("../Models/AdminModel");
const SECRET_KEY =
  "Nikk.Vikas@95181!Hisar###$B(&^$&^%$&^%&$arwala^9~1@@'Delhi_4947948Har(&%&^*$*^%#&$%yana_$$&&India&^7658765865^%&*^%#$@^$#@#$&%^#@#@&%#$^";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
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
/* GET users listing. */
const WelcomeMail = require("../Mails/WelcomeMail");
const LoginAlertMail = require("../Mails/LoginAlertMail");
const OTPMail = require("../Mails/OTPMail");
Router.post("/register", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  try {
    let FindUser = await Admin.findOne({ email });
    if (FindUser) {
      res.status(400).send({
        success: false,
        status: 400,
        message: "Email already exist with another user",
      });
    }
    console.log(FindUser);
    const Salt = await bcrypt.genSalt(10);
    const GenPass = await bcrypt.hash(password, Salt);
    req.body.password = GenPass;
    const CreateUser = await Admin.create(req.body);
    WelcomeMail(firstName, email);

    res.status(200).send({
      success: true,
      status: 200,
      message: "Account Created Successfuly",
    });
  } catch (error) {
    console.log(error);
  }
});

Router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let FindUser = await Admin.findOne({ email });

    if (!FindUser) {
      res.status(400).send({
        status: 400,
        success: false,
        message: "Email Does not exixt in Our System",
      });
    }
    let ComparePassword = await bcrypt.compare(password, FindUser?.password);

    if (!ComparePassword) {
      res.status(401).send({
        status: 401,
        success: false,
        message: "Crendetials is Incorect",
      });
      return LoginAlertMail(email);
    }

    const Data = {
      Auth: {
        id: FindUser.id,
      },
    };

    const token = jwt.sign(Data, SECRET_KEY, { expiresIn: "24h" });

    res.status(200).send({
      success: true,
      token,
      status: 200,
      message: "Logged in successfuly",
    });
  } catch (error) {
    console.log(error);
  }
});

Router.get("/users", async (req, res, next) => {
    try {
        
        let GetUsers = await Users.find({});
        res.status(200).send({ success: true, status: 200, data: GetUsers });
    } catch (error) {
     next(error)   
    }
});

Router.get("/profile", VerifyUser, async (req, res) => {
  try {
    let token = req.header("Authorization");
    const Decode = jwt.verify(token, SECRET_KEY);
    const { id } = Decode?.Auth;
    console.log(id);

    let FindUser = await Admin.findById(id).select("-password");

    if (!FindUser) {
      res
        .status(400)
        .send({ message: "User not found", status: 400, success: false });
    }

    res.send({
      data: FindUser,
      success: true,
      status: 200,
      message: "User details fetched successfuly",
    });
  } catch (error) {
    console.log(error);
  }
});

Router.put("/edit-profile", VerifyUser, async (req, res) => {
  const token = req.header("Authorization");
  const decode = jwt.verify(token, SECRET_KEY);
  const { id } = decode?.Auth;

  if (id) {
    const user = await Admin.findById(id);
    if (!user) {
      res
        .status(400)
        .send({ status: 400, success: false, message: "User does'nt exist" });
    }
    let UpdateUser = await Admin.findByIdAndUpdate({ _id: id }, req.body);
    if (UpdateUser) {
      res.status(200).send({
        success: true,
        status: 200,
        message: "Profile updated successfuly",
      });
    }
  }
});

Router.post("/forgot-password", async (req, res, next) => {
  try {
    let { email } = req.body;

    let findUser = await Admin.findOne({ email });
    if (!findUser) {
      res
        .status(400)
        .send({ success: false, status: 400, message: "Email does'nt exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 90000);
    const AddOTP = await OTP.create({
      email: email,
      otp: otp,
    });

    if (AddOTP) {
      OTPMail(email, otp);
      res.status(200).send({
        success: true,
        status: 200,
        message: "Otp sent to your Email",
      });
    }
  } catch (error) {
    next(error);
    // console.log(error);
  }
});

Router.post("/otp-verify", async (req, res, next) => {
  try {
    let { otp, email } = req.body;

    let FindOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(FindOTP, "===================");
    if (FindOTP == null || otp != FindOTP?.otp) {
      return res
        .status(400)
        .send({ code: 400, message: "The OTP is not valid", success: false });
    }

    res.status(200).send({
      success: true,
      status: 200,
      message: "OTP verified successfuly",
    });
  } catch (error) {
    next(error);
  }
});

Router.put("/reset-password", async (req, res, next) => {
  try {
    const { newPassword, email } = req.body;

    let FindEmail = await Admin.findOne({ email });
    if (!FindEmail) {
      res
        .status(400)
        .send({ success: false, status: 400, message: "Email does'nt exist" });
    }

    const Gensalt = await bcrypt.genSalt(10);
    const GenPass = await bcrypt.hash(newPassword, Gensalt);

    const UpdatePassword = await Admin.updateOne(
      {
        email: email,
      },
      { $set: { password: GenPass } }
    );
    if (UpdatePassword) {
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Password reset successfuly",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Router.post("/imageUpload", upload.single("file"), async (req, res) => {
//   console.log(req.files);
//   const UploadImage = upload.single(req.files);
//   console.log(UploadImage, "==========================");
// });

Router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = Router;
