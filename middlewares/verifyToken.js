require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = process.env.SECRET_KEY;

module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;


  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      console.log("token: ", token);
      console.log("error verified token");
      console.log(err);
      return res.redirect('/login');
    }
    else {
      res.locals.user = decodedToken;
      next();
    }
  });
}