const validator = require('validator');
const isEmpty = require('./is-empty');
const _ = require('lodash');

module.exports = function validateLoginInput(data) {
  let errors = {};

  // data.email = !isEmpty(data.email) ? data.email : '';
  // data.password = !isEmpty(data.password) ? data.password : '';
  const email = _.trim(data.email);
  const password = _.trim(data.password);

  if (validator.isEmpty(email)) {
    errors.email = 'Email is reqired';
  }
  if (!validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};
