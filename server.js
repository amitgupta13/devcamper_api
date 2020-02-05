const express = require("express");
require("express-async-errors");
const app = express();
const dotenv = require("dotenv");
const colors = require("colors");
const connDB = require("./startup/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

//conn to DB
connDB();

require("./startup/routes")(app);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Err: ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
