const express = require('express');
const router = express.Router();
const pool = require('../config/db')

// Define a route for adding a task
router.post('/add-task', (req, res) => {
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
router.post('/delete-task', (req, res) => {
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
router.get('/all-task', (req, res) => {
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


module.exports = router;