const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['elderly', 'caretaker', 'family'],
      default: 'elderly',
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    languagePreference: {
      type: String,
      enum: ['en', 'ta'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, email: this.email, name: this.name },
    process.env.JWT_SECRET || 'eldercare_jwt_secure_super_secret_key_2026_dev',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
