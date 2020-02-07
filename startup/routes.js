const bootcampRoutes = require("../routes/bootcamps");
const coursesRoutes = require("../routes/courses");
const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");
const reviewRoutes = require("../routes/reviews");
const morgan = require("morgan");
const express = require("express");
const error = require("../middlewares/error");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

module.exports = app => {
  //dev logging middleware
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  app.use(express.json());
  app.use(cookieParser());
  app.use(fileUpload());
  app.use(mongoSanitize());
  app.use(express.static(path.join(__dirname, "../public")));
  app.use("/api/v1/bootcamps", bootcampRoutes);
  app.use("/api/v1/courses", coursesRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use(error);
};
