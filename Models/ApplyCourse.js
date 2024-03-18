const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  course_id: { type: mongoose.Types.ObjectId, ref: "courses", required: true },
  courseName: { type: String, required: true },
  userName: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  applicationStatus: { type: String, default: "pending" },
  status: { type: String, default: "active" },
});

Schema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Model = mongoose.model("AppliedCourses", Schema);

module.exports = Model;
