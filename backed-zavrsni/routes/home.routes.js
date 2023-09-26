const express = require("express");
const router = express.Router();
//const db = require('../db');

//nema ulogu
router.get("/", function (req, res, next) {
  res.send(
    "<h1>if ur evr feelin sad jus remembr dat u probly deserve it!</h1>"
  );
});

module.exports = router;
