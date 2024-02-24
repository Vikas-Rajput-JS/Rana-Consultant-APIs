const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String},
    email:{type:String,required:true,unique:true},
    MobileNo:{type:String},
    address:{type:String},
    gender:{type:String},
    image:{type:String},
    password:{type:String,require:true}

})


Schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });


  const Model = mongoose.model('users',Schema)

  module.exports = Model;