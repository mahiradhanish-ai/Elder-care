const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { seedDemoData } = require('../controllers/seedController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/seed-demo', seedDemoData);

module.exports = router;
