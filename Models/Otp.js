const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  otp: { type: String, required: true },
  email:{
    type:String,
    required:true
        },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "10m",
  },
});


const Model = mongoose.model('otp',Schema)


module.exports = Model;