const express = require("express");
const PaymentModel = require("../Models/Payments");
const PaymentSchema = require("../SchemaValdations/Payment");
const ValidationMiddleWare = require("../MiddleWare/JoiValidator");
const Cards = require("../Models/Cards");
const Users = require("../Models/Users");
const VerifyUser = require("../MiddleWare/VerifyUser");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "Nikk.Vikas@95181!Hisar###$B(&^$&^%$&^%&$arwala^9~1@@'Delhi_4947948Har(&%&^*$*^%#&$%yana_$$&&India&^7658765865^%&*^%#$@^$#@#$&%^#@#@&%#$^";

Router.get("/cards", VerifyUser, async (req, res) => {
  try {
    let token = req.header("Authorization");
    let decode = jwt.verify(token, SECRET_KEY);
    const { id } = decode?.Auth;

    let FindCards = await Cards.find({ _id: id });
    res.status(200).send({
      success: true,
      staus: 200,
      data: FindCards,
      total: FindCards?.length,
    });
  } catch (error) {
    console.log(error);
  }
});

Router.get("/payments", async (req, res) => {
  let count = req.query.count || 5;
  let page = req.query.page || 1;
  let search = req.query.search || "";
  let Find = {};

  if (search) {
    Find.$or = [
      {
        cardNo: { $regex: search, $options: "i" },
        expiryMonth: { $regex: search, $options: "i" },
        cvc: { $regex: search, $options: "i" },
        expiryMonth: { $regex: search, $options: "i" },
      },
    ];
  }

  let findPayments = await PaymentModel.find(Find);
  res.status(200).send({
    success: true,
    status: 200,
    message: "Payments fetched successfuly",
    data: findPayments,
  });
});

Router.post("add-card", async (req, res) => {
  try {
    let { cardNo, user_id, expiryMonth, expiryYear, cvc, cardHolder } =
      req.body;

    let findUser = await Users.findById(user_id);
    if (!findUser) {
      return res
        .status(400)
        .send({ message: "User not found", success: false, status: 400 });
    }

    if (findUser.cardNo == cardNo) {
      return res
        .status(400)
        .send({ message: "Card already exist.", success: false, status: 400 });
    }

    let CreateCard = await Cards.create({
      cardNo,
      user_id,
      expiryMonth,
      expiryYear,
      cvc,
      cardHolder,
    });

    CreateCard.save();
    if (CreateCard) {
      res.status(200).send({
        success: true,
        message: "Card Added Successfuly",
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

Router.post(
  "/payment",
  ValidationMiddleWare(PaymentSchema.Data),
  async (req, res) => {
    try {
      let {
        cardNo,
        user_id,
        expiryMonth,
        expiryYear,
        cardHolder,
        cvc,
        course_id,
        price,
      } = req.body;

      let findUser = await Users.find({ user_id });
      if (!findUser) {
        return res
          .status(400)
          .send({ message: "User not found", success: false, status: 400 });
      }

      let findCourse = await PaymentModel.find({
        user_id: user_id,
        course_id: course_id,
      });
      console.log(findCourse);
      if (findCourse?.length > 0) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "You have already applied for this course",
        });
      }

      let CreatePayment = await PaymentModel.create({
        cardNo,
        user_id,
        expiryYear,
        cvc,
        expiryMonth,
        course_id,
        price,
        cardHolder,
      });

      CreatePayment.save();

      if (CreatePayment) {
        return res.status(200).send({
          message: "Payment succesfuly completed",
          success: true,
          status: 200,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = Router;
