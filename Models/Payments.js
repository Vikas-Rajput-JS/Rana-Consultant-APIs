const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  course_id: { type: mongoose.Types.ObjectId, ref: "courses", required: true },
  cardNo: { type: String, required: true },
  cvc: { type: String, required: true },
  expiryMonth: { type: String, required: true },
  expiryYear: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  cardHolder: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

Schema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Model = mongoose.model("payments", Schema);

module.exports = Model;
