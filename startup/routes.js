const bootcampRoutes = require("../routes/bootcamps");
const coursesRoutes = require("../routes/courses");
const morgan = require("morgan");
const express = require("express");
const error = require("../middlewares/error");

module.exports = app => {
  //dev logging middleware
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  app.use(express.json());
  app.use("/api/v1/bootcamps", bootcampRoutes);
  app.use("/api/v1/courses", coursesRoutes);
  app.use(error);
};
