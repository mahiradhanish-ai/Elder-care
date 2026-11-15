const express = require('express');
const router = express.Router();
const {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} = require('../controllers/medicationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMedications);
router.post('/', protect, createMedication);
router.put('/:id', protect, updateMedication);
router.delete('/:id', protect, deleteMedication);

module.exports = router;
