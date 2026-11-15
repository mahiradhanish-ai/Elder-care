const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  getManagedProfiles,
  getProfileById,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/my-profile', protect, getMyProfile);
router.put('/my-profile', protect, updateProfile);
router.get('/managed', protect, getManagedProfiles);
router.get('/:id', protect, getProfileById);
router.put('/:id', protect, updateProfile);

module.exports = router;
