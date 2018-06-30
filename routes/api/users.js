const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
const User = require('../../models/User');

// Load Input Validation
// const validateRegisterInput = require('../../validation/register');
// const validateLoginInput = require('../../validation/login');

// @route GET api/users/test
// @desc  Test user route
// @access Public
router.get('/test', (req, res) => res.json({ message: 'User works' }));

// @route GET api/users/register
// @desc  Register user
// @access Public
router.post('/register', (req, res) => {
  // let { errors, isValid } = validateRegisterInput(req.body);
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      //errors.email = 'Email already exists';
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});
// @route GET api/users/login
// @desc  Ligin User / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  //let { errors, isValid } = validateLoginInput(req.body);

  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json({ email: 'User not found' });
    }
    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

// @route GET api/users/current
// @desc  Returns the current user
// @access Private

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
