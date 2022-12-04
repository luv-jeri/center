const { model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { EmployeeSchema } = require('../schemas');

EmployeeSchema.pre('save', function (next) {
  //* Return if password is not modified
  if (!this.isModified('password')) return next();

  this.password = bcrypt.hashSync(this.password, 10);
  this.confirmPassword = null;

  next();
});

EmployeeSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

EmployeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

EmployeeSchema.methods.setOTP = async function () {
  const OTP = Math.floor(100000 + Math.random() * 900000);

  this.OTP = OTP;
  this.OTPExpiresIn = Date.now() + 10 * 60 * 1000;

  this.resetToken = null;
  this.resetTokenExpiresIn = null;

  await this.save({ validateBeforeSave: false });

  return OTP;
};

EmployeeSchema.methods.checkOTP = async function (OTP) {
  this.resetToken = null;
  if (this.OTP !== OTP) return false;

  if (this.OTPExpiresIn < Date.now()) {
    this.OTP = null;
    this.OTPExpiresIn = null;

    await this.save({ validateBeforeSave: false });

    return false;
  }

  this.resetToken = crypto.randomBytes(32).toString('hex');
  this.resetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  this.OTP = null;
  this.OTPExpiresIn = null;

  await this.save({ validateBeforeSave: false });

  return this.resetToken;
};

EmployeeSchema.methods.resetPassword = async function (
  resetToken,
  password,
  confirmPassword
) {
  if (this.resetToken !== resetToken) return false;

  this.password = password;
  this.confirmPassword = confirmPassword;

  this.resetToken = null;
  this.resetTokenExpiresIn = null;

  await this.save();
};

const PatnerModel = model('Patner', EmployeeSchema);

module.exports = PatnerModel;
