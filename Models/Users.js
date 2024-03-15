const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String },
  dialCode: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  lat: { type: String },
  lng: { type: String },
  image: { type: String },
  password: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

Schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Model = mongoose.model("users", Schema);

module.exports = Model;
