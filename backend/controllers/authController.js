const User = require('../models/User');
const ElderlyProfile = require('../models/ElderlyProfile');
const CareTeam = require('../models/CareTeam');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, languagePreference } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'elderly',
      phone: phone || '',
      languagePreference: languagePreference || 'en',
    });

    let profile = null;

    // If elderly, automatically create ElderlyProfile
    if (user.role === 'elderly') {
      profile = await ElderlyProfile.create({
        userId: user._id,
        fullName: user.name,
        emergencyContact: {
          name: '',
          relationship: 'Family',
          phone: user.phone || '',
        },
      });
    }

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        languagePreference: user.languagePreference,
      },
      profile,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    const token = user.getSignedJwtToken();

    // Fetch associated elderly profile or care relationships
    let profile = null;
    let managedProfiles = [];

    if (user.role === 'elderly') {
      profile = await ElderlyProfile.findOne({ userId: user._id });
    } else {
      // Find elderly profiles this caretaker or family member is assigned to
      const careTeams = await CareTeam.find({
        memberUserId: user._id,
        status: 'active',
      }).populate('elderlyProfileId');

      managedProfiles = careTeams.map((ct) => ct.elderlyProfileId).filter(Boolean);
      profile = managedProfiles.length > 0 ? managedProfiles[0] : null;
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        languagePreference: user.languagePreference,
      },
      profile,
      managedProfiles,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current logged in user & profiles
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    let managedProfiles = [];

    if (user.role === 'elderly') {
      profile = await ElderlyProfile.findOne({ userId: user._id });
    } else {
      const careTeams = await CareTeam.find({
        memberUserId: user._id,
        status: 'active',
      }).populate('elderlyProfileId');

      managedProfiles = careTeams.map((ct) => ct.elderlyProfileId).filter(Boolean);
      profile = managedProfiles.length > 0 ? managedProfiles[0] : null;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        languagePreference: user.languagePreference,
      },
      profile,
      managedProfiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user details',
    });
  }
};
