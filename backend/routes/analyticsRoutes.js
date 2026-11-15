const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/:elderlyId', protect, getAnalytics);

module.exports = router;
