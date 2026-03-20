const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const eventRoutes = require('./routes/eventRoutes');
const memberRoutes = require('./routes/memberRoutes');

// Load env vars
dotenv.config();

// Connect to databas
connectDB();

const app = express();

// Security Middleware
// 1. Set security headers
app.use(helmet());

// 2. Prevent DDoS / Brute Force with Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per 10 mins
    message: 'Too many requests from this IP, please try again after 10 minutes.'
});
app.use('/api', limiter); // Apply rate limiter to all API routes

// Standard Middleware
app.use(express.json());
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
