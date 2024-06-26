require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = process.env.SECRET_KEY;

module.exports.generateToken = (username)=> {
    return jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
  }