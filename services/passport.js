const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            // console.log('access token', accessToken);
            // console.log('refresh token', refreshToken);
            // console.log('profile:', profile);

            User.findOne({ googleId: profile.id }).then(existingUser => {
                if (existingUser) {
                    // we already have a recor with the given profile ID
                } else {
                    // we don't have a user record with this ID, make a new record
                    new User({ googleId: profile.id }).save();
                }
            });
        }
    )
);
