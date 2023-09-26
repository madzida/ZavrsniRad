const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
let token;

verifyToken = (req, res, next) => {
  //dohvati token
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    token = bearer[1];
  } else {
    // Ako nije poslan onda..
    return res.status(403).send({
      message: "Where's my token?!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    try {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      next();
    } catch {}
  });
};

verifyTokenWeb = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    token = bearer[1];
  } else {
    // Ako nije poslan onda..
    return res.status(403).send({
      err: "Where's my token?!",
    });
  }

  jwt.verify(token, config.secretWeb, (err, decoded) => {
    try {
      if (err) {
        return res.status(401).send({
          err: "Unauthorized!",
        });
      }
      next();
    } catch {}
  });
};

getTeacherEmail = () => {
  return jwt.decode(token).email;
};

getStudent = () => {
  return jwt.decode(token);
};

const authJwt = {
  verifyToken: verifyToken,
  getStudent: getStudent,
  verifyTokenWeb: verifyTokenWeb,
  getTeacherEmail: getTeacherEmail,
};

module.exports = authJwt;
