const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },

  cardNo: { type: Number, required: true },
  cvc: { type: Number, required: true },
  expiryMonth: { type: Number, required: true },
  expiryYear: { type: Number, required: true },
  cardHolder: { type: String, require: true },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

Schema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Model = mongoose.model("cards", Schema);

module.exports = Model;
