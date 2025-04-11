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

// Add detailed logging for environment variables
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://dr-ritesh-healthcare-clinic-wze6.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));
app.use(morgan('dev'));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to Database with retry logic
const connectWithRetry = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    // Retry after 5 seconds
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Remove local file system handling
// const uploadsPath = path.join(__dirname, 'uploads');
// console.log('Serving static files from:', uploadsPath);

// if (!fs.existsSync(uploadsPath)) {
//   console.log('Creating uploads directory...');
//   fs.mkdirSync(uploadsPath, { recursive: true });
// }

// Configure static file serving with detailed logging
// app.use('/uploads', express.static(uploadsPath, {
//   setHeaders: (res, filePath) => {
//     console.log('Serving file:', filePath);
//     res.set('Access-Control-Allow-Origin', '*');
//     res.set('Cache-Control', 'public, max-age=3600');
//     // Set content type based on file extension
//     const ext = path.extname(filePath).toLowerCase();
//     if (ext === '.jpg' || ext === '.jpeg') {
//       res.set('Content-Type', 'image/jpeg');
//     } else if (ext === '.png') {
//       res.set('Content-Type', 'image/png');
//     }
//   }
// }));

// Add error handling for static files
// app.use('/uploads', (err, req, res, next) => {
//   console.error('Error serving static file:', err);
//   console.error('Requested path:', req.path);
//   res.status(404).send('File not found');
// });

// Add root path handler
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Healthcare Clinic API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/lab-tests', labTestRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Export the Express API
module.exports = app;