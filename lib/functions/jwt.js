const jwt = require('jsonwebtoken');

const sign_token = (data) => {
  if (Object.keys(data).length === 0) return null;
  if (typeof data !== 'object') return null;
  
  return jwt.sign({ ...data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const verify_token = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  sign_token,
  verify_token,
};
