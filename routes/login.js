require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { generateToken } = require('../middlewares/generateToken');
const pool = require('../config/db');


router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Hash the password 
  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {
      if (results.length === 0) {
        // User not found
        res.status(401).send('Invalid username or password.');
      } else {
        const user = results[0];

        await bcrypt.compare(password, user.pass, (err, result) => {
          if (result) {
            const token = generateToken(user);
            res.cookie('token', token, { maxAge: 3600000 });
            res.redirect('/');
          }
          else {
            res.status(500).send('Error comparing passwords');
            return;
          }
        });
      }
    }
  });
});


module.exports = router;