const validator = require('validator');
// const isEmpty = require('./is-empty');
const _ = require('lodash');

module.exports = function validateProfileInput(data) {
  const errors = {};

  // data.email = !isEmpty(data.email) ? data.email : '';
  // data.password = !isEmpty(data.password) ? data.password : '';
  const handle = _.trim(data.handle);
  const status = _.trim(data.status);
  const skills = _.trim(data.skills);
  const website = _.trim(data.website);
  const youtube = _.trim(data.youtube);
  const twitter = _.trim(data.twitter);
  const facebook = _.trim(data.facebook);
  const linkedin = _.trim(data.linkedin);
  const instagram = _.trim(data.instagram);

  if (!validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 40 characters';
  }
  if (validator.isEmpty(handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (validator.isEmpty(status)) {
    errors.status = 'Status field is required';
  }
  if (validator.isEmpty(skills)) {
    errors.skills = 'Skills field is required';
  }
  if (!_.isEmpty(website) && !validator.isURL(website)) {
    errors.website = 'Not a valid url';
  }
  if (!_.isEmpty(youtube) && !validator.isURL(youtube)) {
    errors.youtube = 'Not a valid url';
  }
  if (!_.isEmpty(twitter) && !validator.isURL(twitter)) {
    errors.twitter = 'Not a valid url';
  }
  if (!_.isEmpty(facebook) && !validator.isURL(facebook)) {
    errors.facebook = 'Not a valid url';
  }
  if (!_.isEmpty(linkedin) && !validator.isURL(linkedin)) {
    errors.linkedin = 'Not a valid url';
  }
  if (!_.isEmpty(instagram) && !validator.isURL(instagram)) {
    errors.instagram = 'Not a valid url';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};
