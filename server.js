const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = crypto.randomBytes(32).toString('hex');

// Configure body-parser to handle form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser()); 

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin1234',
  database: 'to_do_list',
});

// Function to generate a JWT
function generateToken(user) {
  return jwt.sign({ username: user.username, password: user.pass }, secretKey, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const token = req.cookies.token; // Read the token from the 'token' cookie

  if (!token) {
    return res.status(401).send('Access token not provided.');
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(403).send('Invalid or expired token.');
    }
    req.user = decodedToken;
    next();
  });
}

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Hash the password using SHA-256
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {
      if (results.length === 0) {
        // User not found
        res.status(401).send('Invalid username or password.');
      } else {
        const user = results[0];
        if (user.pass === hashedPassword) {
          // Password matched, login successful

          // Generate a token
          const token = generateToken(user);

          // Set the token as an HTTP-only cookie
          res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry

          res.redirect('/main.html');
        } else {
          // Password did not match
          res.status(401).send('Invalid username or password.');
        }
      }
    }
  });
});


// Handle form submission
app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Hash the password using SHA-256
  const hashedPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

  // Insert the hashed password and salt into the MySQL database
  pool.query('INSERT INTO users (username, pass) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
    if (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {
      console.log('Data saved to the database successfully!');
      res.redirect('/main.html');
    }
  });
});

app.use(express.json());

// Define a route for adding a task
app.post('/add-task', (req, res) => {
  const task = req.body.task;

  if (task) {
    // Insert the task into the MySQL database
    pool.query('INSERT INTO tasks (task) VALUES (?)', [task], (error, results) => {
      if (error) {
        console.error('Error adding task:', error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

// Define a route for deleting a task
app.post('/delete-task', (req, res) => {
  const taskId = req.body.taskId;

  if (taskId) {
    // Delete the task from the MySQL database
    pool.query('DELETE FROM tasks WHERE id = ?', [taskId], (error, results) => {
      if (error) {
        console.error('Error deleting task:', error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

// Define a route for fetching all tasks
app.get('/tasks', (req, res) => {
  // Retrieve all tasks from the MySQL database
  pool.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      console.error('Error fetching tasks:', error);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
