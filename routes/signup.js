require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {generateToken }= require('../middlewares/generateToken');
const pool = require('../config/db');

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', async(req, res) => {
  const username = req.body.username;
  const password = req.body.password;

    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

  pool.query('INSERT INTO users (username, pass) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
    if (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {
      console.log('Data saved to the database successfully!');
      const token = generateToken(username);
      res.cookie('token', token, { maxAge: 3600000 });
      res.redirect('/');
    }
  });
});

module.exports = router;