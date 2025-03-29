const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');



// Import routes
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.use(express.json());
app.use('/api/tasks', taskRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Start server only if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app;
