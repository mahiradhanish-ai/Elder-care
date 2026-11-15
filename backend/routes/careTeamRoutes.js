const express = require('express');
const router = express.Router();
const {
  getCareTeam,
  joinByPasscode,
  inviteMember,
  revokeAccess,
} = require('../controllers/careTeamController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCareTeam);
router.post('/join-by-passcode', protect, joinByPasscode);
router.post('/invite', protect, inviteMember);
router.delete('/:id', protect, revokeAccess);

module.exports = router;
