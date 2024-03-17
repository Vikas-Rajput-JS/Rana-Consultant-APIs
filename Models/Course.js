const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  price: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  collegeName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: Number },
  status:{type:String,default:'active'},
  registrationFees: { type: Number, required: true },
});

Schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const Model = mongoose.model("courses", Schema);

module.exports = Model;
