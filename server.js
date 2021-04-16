const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const services = require("./services");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT;
const { createMiddleware } = require("./middlewares");
const middleware = createMiddleware();
const jsonwebtoken = require("jsonwebtoken");
const commonCtrl = require("./src/controllers/common.controller");

// create express app
const app = express();
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.mongoDB, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("ENV => " + process.env.mongoDB);
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

//JWT decoder
// app.use(function (req, res, next) {
//   if (
//     req.headers &&
//     req.headers.authorization &&
//     req.headers.authorization.split(" ")[0] === "Bearer"
//   ) {
//     jsonwebtoken.verify(
//       req.headers.authorization.split(" ")[1],
//       process.env.apiKey,
//       function (err, decode) {
//         if (err) req.user = undefined;
//         req.user = decode;
//         next();
//       }
//     );
//   } else {
//     req.user = undefined;
//     next();
//   }
// });

//check logged in
// app.use(async function (req, res, next) {
//   if (req.headers && req.headers.logintoken) {
//     const result = await commonCtrl.checkUserLoggedin(req);
//     if (result.isLoggedIn) {
//       req.isLoggedIn = true;
// 	req.userDoc = result.userDoc
//     }
//     next();
//   } else {
//   req.isLoggedIn = false;
//   req.userDoc = {}
//     next();
//   }
// });

// define a simple route
app.get("/", (req, res) => {
  res.json({
    message: "CAFS APIs",
  });
});
services({ app, middleware });

// listen for requests
app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
