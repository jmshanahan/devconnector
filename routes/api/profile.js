const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load profile model
const Profile = require('../../models/Profile');

// @route GET api/profile/test
// @desc  Test profile route
// @access Public
router.get('/test', (req, res) => res.json({ message: 'Profile works' }));

// @route GET api/profile/Profile
// @desc  Get current users profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        return res.json(profile);
      })
      .catch(err => res.status(404).json(err));
    return res;
  }
);

module.exports = router;
