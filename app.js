var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const CommonAPI = require("./routes/CommonAPI");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const UserRouter = require("./routes/users");
const AdminRouter = require("./AdminRoutes/User");
const CourseRouter = require("./routes/Courses");
const PaymentRoutes = require("./routes/Payments");

require("./Connection/DB");
var app = express();
app.use(cors());
app.use(bodyParser());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// app.use(fileUpload())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  "/images/modal=user",
  express.static(path.join(__dirname, "public/data/uploads"))
);

app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/", UserRouter);
app.use("/common", CommonAPI);
app.use("/admin", AdminRouter);
app.use("/", CourseRouter);
app.use("/", PaymentRoutes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
