require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/default');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/error');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const adminRoutes = require('./routes/admin');
const appointmentRoutes = require('./routes/appointments');
const medicineRoutes = require('./routes/medicines');
const labTestRoutes = require('./routes/labTests');

// Connect to Database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173', // instead of `true`
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  exposedHeaders: ['x-auth-token']
};


// Apply CORS middleware before any routes
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Serve static files from uploads directory with logging
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);

// Check if uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Configure static file serving with detailed logging
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    console.log('Serving file:', filePath);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=3600');
    // Set content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      res.set('Content-Type', 'image/jpeg');
    } else if (ext === '.png') {
      res.set('Content-Type', 'image/png');
    }
  }
}));

// Add error handling for static files
app.use('/uploads', (err, req, res, next) => {
  console.error('Error serving static file:', err);
  console.error('Requested path:', req.path);
  res.status(404).send('File not found');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/lab-tests', labTestRoutes);

// Error Handler Middleware (should be last)
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

// Start the server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- /api/auth');
  console.log('- /api/doctors');
  console.log('- /api/patients');
  console.log('- /api/admin');
  console.log('- /api/appointments');
  console.log('- /api/medicines');
  console.log('- /api/lab-tests');
});

module.exports = app;