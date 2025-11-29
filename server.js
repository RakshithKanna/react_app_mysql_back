const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3001; // Choose a different port than your React app (which is likely 3000)

app.use(cors()); // Allows your React app to make requests to this server
app.use(express.json()); // Parses JSON body from the frontend

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL host
  user: 'root',           // Your MySQL username
  password: 'Kanna$', // Your MySQL password
  database: 'project_demo' // Your database name
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database: project_demo');
});

// Define the login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // IMPORTANT: This is a basic example. In a real application, you must 
  // HASH passwords using libraries like bcrypt both when storing them 
  // and when validating them.
  const query = 'SELECT * FROM user_login WHERE user_name = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error during login.' });
    }

    if (results.length > 0) {
      // User found and credentials match
	  console.log(`User "${username}" logged in successfully at ${new Date().toISOString()}`);
      
      res.status(200).json({ 
        message: 'Login successful!', 
        user: results[0],
        isAuthenticated: true 
      });
    } else {
      // No user found or incorrect credentials
      res.status(401).json({ message: 'Invalid username or password.', isAuthenticated: false });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

