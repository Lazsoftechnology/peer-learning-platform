// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path'); // Import path module

const app = express(); // Initialize Express app first

// Add this middleware in app.js before other routes
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "script-src 'self'"
    );
    next();
});

app.use(bodyParser.json()); // Ensure body-parser is used to parse JSON bodies
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend'))); // Adjust path to your frontend folder

const secretKey = 'your_secret_key'; // Use a secure key in production

// Root route for testing server connection
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html')); // Serve index.html on root
});

// Helper function to generate JWT
function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
}

// User Registration
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received data:', req.body); // Add this line to check incoming data

    if (!name || !email || !password) { // Check for all required fields
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error); // Log error for debugging
        res.status(500).json({ error: 'User registration failed' });
    }
});
// Middleware to protect routes
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Token missing' });

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Get User Profile
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT name, email, accessibility_options, subjects FROM users WHERE id = ?', [req.user.id]);
        res.json(users[0]);
    } catch (error) {
        console.error('Error retrieving profile:', error); // Log error for debugging
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
});

// Update User Profile
app.put('/profile', authenticateToken, async (req, res) => {
    const { name, accessibility_options, subjects } = req.body;

    if (!name || !accessibility_options || !subjects) { // Check for all required fields
        return res.status(400).json({ error: 'Name, accessibility options, and subjects are required' });
    }

    try {
        await db.query('UPDATE users SET name = ?, accessibility_options = ?, subjects = ? WHERE id = ?', [name, JSON.stringify(accessibility_options), JSON.stringify(subjects), req.user.id]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error); // Log error for debugging
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


// Search Tutors
app.get('/tutors', authenticateToken, async (req, res) => {
    const { subject, accessibilityNeeds } = req.query;

    try {
        const [tutors] = await db.query(
            'SELECT * FROM tutors WHERE JSON_CONTAINS(subjects, ?) AND JSON_CONTAINS(accessibility_options, ?)',
            [JSON.stringify([subject]), JSON.stringify(accessibilityNeeds)]
        );
        res.json(tutors);
    } catch (error) {
        console.error('Error fetching tutors:', error); // Log error for debugging
        res.status(500).json({ error: 'Failed to fetch tutors' });
    }
});

// Update Tutor Availability
app.post('/tutors', authenticateToken, async (req, res) => {
    const { subjects, availability, accessibility_options } = req.body;

    if (!subjects || !availability || !accessibility_options) { // Check for all required fields
        return res.status(400).json({ error: 'Subjects, availability, and accessibility options are required' });
    }

    try {
        await db.query(
            'INSERT INTO tutors (user_id, subjects, availability, accessibility_options) VALUES (?, ?, ?, ?)',
            [req.user.id, JSON.stringify(subjects), availability, JSON.stringify(accessibility_options)]
        );
        res.json({ message: 'Tutor availability added' });
    } catch (error) {
        console.error('Error adding tutor availability:', error); // Log error for debugging
        res.status(500).json({ error: 'Failed to add tutor availability' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});