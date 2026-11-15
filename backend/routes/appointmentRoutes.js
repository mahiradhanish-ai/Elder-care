const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAppointments);
router.post('/', protect, createAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
