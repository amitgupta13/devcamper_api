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
const helmet = require("helmet");
const xxs = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

module.exports = app => {
  //dev logging middleware
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  app.use(express.json());
  app.use(cookieParser());
  app.use(fileUpload());
  //sanitize data
  app.use(mongoSanitize());
  //security headers
  app.use(helmet());
  //prevent cross site scripting
  app.use(xxs());
  //rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
  });
  app.use(limiter);
  //prevent http param pollution
  app.use(hpp());
  //Enable cors
  app.use(cors());
  app.use(express.static(path.join(__dirname, "../public")));
  app.use("/api/v1/bootcamps", bootcampRoutes);
  app.use("/api/v1/courses", coursesRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use(error);
};
