const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load profile model
const Profile = require('../../models/Profile');
const validateProfileInput = require('../../validation/profile');

// @route GET api/profile/test
// @desc  Test profile route
// @access Public
router.get('/test', (req, res) => res.json({ message: 'Profile works' }));

// @route GET api/profile
// @desc  Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(404).json(err));
  return res;
});

// @route GET api/profile/handle/:handle
// @desc  Get profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  console.log(`The name of handle is ${req.params.handle}`);
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      const modifiedErr = Object.assign({}, err, { profile: 'There is no profile for this user' });
      res.status(404).json(modifiedErr);
    });
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user ID
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      const modifiedErr = Object.assign({}, err, { profile: 'There is no profile for this user' });
      res.status(404).json(modifiedErr);
    });
});

// @route POST api/profile
// @desc  Create or Edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  if (typeof req.body.skills !== 'undefined') {
    if (req.body.skills) profileFields.skills = req.body.skills.split(',');
  }
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
        .then(userprofile => res.json(userprofile))
        .catch(err => res.status(404).json(err));
    } else {
      // Create

      // Check if handle exists
      Profile.findOne({ handle: profileFields.handle })
        .then(userHandle => {
          if (userHandle) res.status(400).json({ handle: 'That handle already exists' });
          // Save profile
          new Profile(profileFields).save().then(newProfile => res.json(newProfile));
        })
        .catch(err => {
          const modifiedErr = Object.assign({}, err, { handle: 'There is no handle for this user' });
          res.status(404).json(modifiedErr);
        });
    }
  });
  return res.status(400).json({ error: 'Unexpected error' });
});
module.exports = router;
