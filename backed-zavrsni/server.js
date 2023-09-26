const express = require("express");
const app = express();
const path = require("path");
//const session = require('express-session')
const pg = require("pg");
const db = require("./db");
const cors = require("cors");

let bodyParser = require("body-parser");
//let cookieParser = require('cookie-parser');
let multer = require("multer");
let upload = multer();
//const pgSession = require('connect-pg-simple')(session)

const port = process.env.PORT || 5000;

const homeRouter = require("./routes/home.routes"); // u ovom možda staviti redirect na web. hmm
const webRouter = require("./routes/web.routes");
const classRouter = require("./routes/class.routes");
const testRouter = require("./routes/test.routes");
const loginRouter = require("./routes/login.routes"); //ovo vjerojatno staviti da ide web/login, ali ako rn moze sa cookie, onda posebno
const logoutRouter = require("./routes/logout.routes");

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//middleware - statički resursi
//app.use(express.static(path.join(__dirname, 'client/build')));

//app.use(cors);

// For POST-Support
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//middleware - dekodiranje parametara
app.use(express.urlencoded({ extended: true }));

//definicija ruta
app.use("/", homeRouter);
app.use("/web", webRouter);

app.use("/class", classRouter);
app.use("/test", testRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);

app.listen(port, () => {
  console.log("...");
});
