/** @format */

const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Email ID is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    minlength: [10, 'Minimum 10 digit phone number is required'],
    maxlength: [11, 'Maximum 11 digit phone number is required'],
    unique: true,
  },
  photo: {
    type: String,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/e/e0/Userimage.png',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Minimum 8 character password is required'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // Only works on CREATE & SAVE!!
      validator: function (el) {
        return this.password === el;
      },
      message: 'Passwords do not match!',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

// Only fetch active users
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

// Set passwordChangedAt on password change
userSchema.pre('save', function (next) {
  if (this.isModified('password') || !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

// Password comparison method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (err) {
    console.error('Error occurred: ', err);
  }
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
