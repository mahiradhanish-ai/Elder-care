const express = require('express');
const router = express.Router();
const {
  getTodayDoses,
  updateDoseStatus,
  confirmDoseByToken,
  getHistory,
} = require('../controllers/medicationLogController');
const { protect } = require('../middleware/auth');

// Public route for 1-click email confirmation
router.get('/confirm/:token', confirmDoseByToken);

// Protected routes
router.get('/today', protect, getTodayDoses);
router.get('/history', protect, getHistory);
router.post('/:id/status', protect, updateDoseStatus);

module.exports = router;
