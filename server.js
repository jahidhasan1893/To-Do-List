require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejs = require('ejs');
const { verifyToken } = require('./middlewares/verifyToken');


const app = express();
const port = 3000;



// Serve static files
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//middlewares
app.use(express.json());
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: false }));


// routes 
app.get('/', verifyToken, (req, res)=>{
  res.render('main');
});
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/signout', require('./routes/signout'));
app.use('/tasks', require('./routes/tasks'));


// listen on server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
