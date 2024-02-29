var express = require("express");
const VerifyUser = require("../MiddleWare/VerifyUser");
var Router = express.Router();
const Users = require("../Models/Users");
const SECRET_KEY =
  "Nikk.Vikas@95181!Hisar###$B(&^$&^%$&^%&$arwala^9~1@@'Delhi_4947948Har(&%&^*$*^%#&$%yana_$$&&India&^7658765865^%&*^%#$@^$#@#$&%^#@#@&%#$^";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
/* GET users listing. */
const WelcomeMail = require("../Mails/WelcomeMail");
const LoginAlertMail = require("../Mails/LoginAlertMail");
Router.post("/register", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  try {
    let FindUser = await Users.findOne({ email });
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
    const CreateUser = await Users.create(req.body);
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
    let FindUser = await Users.findOne({ email });

    if (!FindUser) {
      res.status(400).send({
        status: 400,
        success: false,
        message: "Email Does not exixt in Our System",
      });
    }
    console.log(FindUser )
    let ComparePassword = await bcrypt.compare(password, FindUser.password);

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

    const token = jwt.sign(Data, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).send({ success: true, token, status: 200,message:"Logged in successfuly" });
  } catch (error) {
    console.log(error);
  }
});

Router.get("/profile", VerifyUser,async (req, res) => {
  try {
    let token = req.header("Authorization");
    const Decode = jwt.verify(token, SECRET_KEY);
    const {id} = Decode?.Auth;
    console.log(id);

    let FindUser = await Users.findById(id).select('-password');

    if (!FindUser) {
      res
        .status(400)
        .send({ message: "User not found", status: 400, success: false });
    }

    res.send({data:FindUser,success:true,status:200,message:"User details fetched successfuly"})
      


  } catch (error) {

    console.log(error)
  }
});

module.exports = Router;
