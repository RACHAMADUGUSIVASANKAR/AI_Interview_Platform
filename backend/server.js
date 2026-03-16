const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "https://ai-interview-platform-seven-umber.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/interview', require('./routes/interview'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Interview Platform API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



module.exports = app;
