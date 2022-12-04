const catcher = require('../lib/utils/catcher');
const { Patner } = require('../database/models');
const _Error = require('../lib/utils/_Error');
const { verify_token } = require('../lib/functions/jwt');

module.exports.protect = catcher(async (req, res, next) => {
  const { authorization } = req.headers;

  let token = authorization;

  if (!token) return next(new _Error('Please login again', 401));

  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  const decoded = verify_token(token);

  if (!decoded) return next(new _Error('Please login again', 401));

  req.patner = decoded;

  next();
});
