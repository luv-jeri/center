const catcher = require('../lib/utils/catcher');
const { Patner } = require('../database/models');
const _Error = require('../lib/utils/_Error');
const mail = require('../lib/functions/mail.function');

module.exports.join = catcher(async (req, res) => {
  const {
    patnerName,
    photoURL,
    address,
    employeePrefix,
    inoiceNumber,
    email,
    invoicePrefix,
    password,
    confirmPassword,
    phoneNumber,
  } = req.body;

  const { city, addressLine, addressLine2, state, pinCode } = address;

  const new_patner = await Patner.create({
    patnerName,
    photoURL,
    address: { city, addressLine, addressLine2, state, pinCode },
    employeePrefix,
    inoiceNumber,
    email,
    invoicePrefix,
    password,
    confirmPassword,
    phoneNumber,
  });

  const token = await new_patner.generateAuthToken();

  res.status(201).json({
    status: 'success',
    message: 'Welcome to the Innovative family 😀',
    content: {
      patner: new_patner,
      token,
    },
  });
});

module.exports.login = catcher(async (req, res, next) => {
  const { user, password } = req.body;

  if (!user)
    return next(new _Error('Please provide email or phone number or patner name', 400));

  if (!password) return next(new _Error('Please provide password', 400));

  const patner = await Patner.findOne({
    $or: [{ email: user }, { phoneNumber: user }, { patnerName: user }],
  }).select('+password');

  if (!patner || !(await patner.correctPassword(password, patner.password)))
    return next(new _Error('Incorrect email or password', 401));

  const token = patner.generateAuthToken();

  res
    .status(201)
    .json({
      status: 'success',
      message: 'Login successful',
      content: {
        token,
      },
    })
});

module.exports.update_password = catcher(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword) return next(new _Error('Please provide current password', 400));

  if (!newPassword) return next(new _Error('Please provide new password', 400));

  if (!confirmPassword) return next(new _Error('Please provide confirm password', 400));

  if (newPassword !== confirmPassword)
    return next(new _Error('New password and confirm password do not match', 400));

  const patner = await Patner.findById(req.patner._id).select('+password');

  if (!patner || !(await patner.correctPassword(currentPassword, patner.password)))
    return next(new _Error('Incorrect current password', 401));

  patner.password = newPassword;
  patner.confirmPassword = confirmPassword;

  await patner.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});

module.exports.send_reset_OTP = catcher(async (req, res, next) => {
  const { user } = req.body;

  const patner = await Patner.findOne({
    $or: [{ email: user }, { phoneNumber: user }, { patnerName: user }],
  });

  if (!patner)
    return next(new _Error('Incorrect email or phone number or patner name', 401));

  const OTP = await patner.setOTP();

  const message = `Your OTP is ${OTP}. Please enter this OTP to reset your password.`;

  await mail({
    email: patner.email,
    subject: 'Reset Password',
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Please check your email for OTP 😀',
  });
});

module.exports.check_reset_OTP = catcher(async (req, res, next) => {
  const { OTP, user } = req.body;

  const patner = await Patner.findOne({
    $or: [{ email: user }, { phoneNumber: user }, { patnerName: user }],
  });

  if (!patner)
    return next(new _Error('Incorrect email or phone number or patner name', 401));

  const resetToken = await patner.checkOTP(OTP);

  if (!resetToken) return next(new _Error('Incorrect OTP or OTP expired.', 401));

  res.status(200).json({
    status: 'success',
    message: 'OTP is correct 😀',
    content: {
      resetToken,
    },
  });
});

module.exports.reset_password = catcher(async (req, res, next) => {
  const { resetToken, user, password, confirmPassword } = req.body;

  const patner = await Patner.findOne({
    $or: [{ email: user }, { phoneNumber: user }, { patnerName: user }],
  });

  if (!patner)
    return next(new _Error('Incorrect email or phone number or patner name', 401));

  if (password !== confirmPassword)
    return next(new _Error('Password and confirm password does not match', 400));

  const success = await patner.resetPassword(resetToken, password, confirmPassword);

  if (!success) return next(new _Error('Incorrect reset token', 401));

  const token = await patner.generateAuthToken();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful 😀',
    content: {
      token,
    },
  });
});
