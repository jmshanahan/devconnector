const validator = require('validator');

const _ = require('lodash');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  const name = _.trim(data.name);
  const email = _.trim(data.email);
  const password = _.trim(data.password);
  const password2 = _.trim(data.password2);

  if (!validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (validator.isEmpty(name)) {
    errors.name = 'Name is required';
  }
  if (validator.isEmpty(email)) {
    errors.email = 'Email is reqired';
  }
  // console.log(data.email);
  if (!validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password is required';
  }
  if (!validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be atleast 6 characters ';
  }
  if (validator.isEmpty(password2)) {
    errors.password2 = 'ConfirmPassword is required';
  }
  if (!validator.equals(password, password2)) {
    errors.password2 = 'Passwords must be the same';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};
