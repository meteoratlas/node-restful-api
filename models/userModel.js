const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A user name must have less than 40 characters.'],
    minlength: [5, 'A user name must have more than 5 characters.'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'Your password must have more than 8 characters.'],
    // Prevent password from appearing in user queries
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // this only works on CREATE and SAVE
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords must match',
    },
  },
  passwordChangedAt: { type: Date },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// encrypt password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // we don't need passwordConfirm to persist past user creation
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  providedPassword,
  userPassword
) {
  return await bcrypt.compare(providedPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // password was changed after token issue time
    return JWTTimestamp < changedTimestamp;
  }
  // password was not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
