const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  course_id: { type: mongoose.Types.ObjectId, ref: "courses", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

Schema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Model = mongoose.model("AppliedCourses", Schema);

module.exports = Model;
