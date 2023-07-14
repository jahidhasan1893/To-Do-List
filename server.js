const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1234',
});

// connection.connect((error) => {
//   if (error) {
//     console.error('Error connecting to MySQL:', error);
//     return;
//   }
//   console.log('Connected to MySQL!');
// });

// // Handle any unexpected connection errors
// connection.on('error', (error) => {
//   console.error('MySQL connection error:', error);
// });

// // Perform database operations
// // ...

// // Close the MySQL connection when done
// connection.end();

