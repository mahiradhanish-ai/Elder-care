const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const medicationLogRoutes = require('./routes/medicationLogRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const careTeamRoutes = require('./routes/careTeamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const timelineRoutes = require('./routes/timelineRoutes');

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint (for Render uptime pinger, monitoring, and verification)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ElderCare Connect Backend API',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    timezone: process.env.TIMEZONE || 'Asia/Kolkata',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/medication-logs', medicationLogRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/care-team', careTeamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/timeline', timelineRoutes);

// Root API Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to ElderCare Connect API',
    documentation: '/api/health',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/profiles',
      '/api/medications',
      '/api/medication-logs',
      '/api/appointments',
      '/api/care-team',
      '/api/notifications',
      '/api/analytics',
      '/api/timeline',
    ],
  });
});

// 404 Route Not Found handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
