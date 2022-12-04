const validator = require('validator');

module.exports.validPhoneNumber = (phoneNumber) => {
  if (!validator.isMobilePhone(phoneNumber, 'en-IN'))
    throw new Error('Phone Number is invalid');
};

module.exports.validEmail = (email) => {
  if (!validator.default.isEmail(email)) throw new Error('Not a valid email ID');
};

module.exports.validPhotoURL = (url) => {
  // TODO: Better to use a regex that accepts URLs containing acceptable domains
  if (url && !validator.default.isURL(url)) throw new Error('Not a valid URL');
};
