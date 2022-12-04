const { model } = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sign_token } = require('../../lib/functions/jwt');
const { PatnerSchema } = require('../schemas');

PatnerSchema.pre('save', function (next) {
  //* Return if password is not modified
  if (!this.isModified('password')) return next();

  this.password = bcrypt.hashSync(this.password, 10);
  this.confirmPassword = null;

  next();
});

PatnerSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

PatnerSchema.methods.generateAuthToken = function () {
  const token = sign_token(this._doc);
  return token;
};

PatnerSchema.methods.setOTP = async function () {
  const OTP = Math.floor(100000 + Math.random() * 900000);

  this.OTP = OTP;
  this.OTPExpiresIn = Date.now() + 10 * 60 * 1000;

  this.resetToken = null;
  this.resetTokenExpiresIn = null;

  await this.save({ validateBeforeSave: false });

  return OTP;
};

PatnerSchema.methods.checkOTP = async function (OTP) {
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

PatnerSchema.methods.resetPassword = async function (
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

const PatnerModel = model('Patner', PatnerSchema);

module.exports = PatnerModel;
