const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// what user is this? It's the same one from when we either have an existingUser or a newly created user
passport.serializeUser((user, done) => {
    // done takes 2 arugements, 1) error object, 2) user.id is a short cut to the record _id
    done(null, user.id);
});

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
                    // we already have a record with the given profile ID
                    // done takes 2 arugements, 1) error, 2) found the user
                    done(null, existingUser);
                } else {
                    // we don't have a user record with this ID, make a new record
                    new User({ googleId: profile.id })
                        .save()
                        .then(user => done(null, user));
                }
            });
        }
    )
);
