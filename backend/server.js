const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');
const initReminderJob = require('./jobs/reminderJob');

// Connect to MongoDB
connectDB().then(() => {
  // Initialize smart background reminder jobs after DB connection
  initReminderJob();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 ElderCare Connect Server Running`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`⏰ Timezone: ${process.env.TIMEZONE || 'Asia/Kolkata'}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
