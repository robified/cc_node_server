const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// we have to define the serializeUser and deserializeUser function
// what user is this? It's the same one from when we either have an existingUser or a newly created user
// it is a mongoose user model instance
passport.serializeUser((user, done) => {
    // done takes 2 arugements, 1) error object, 2) user.id is a short cut to the record _id
    done(null, user.id);
});

// now we're doing the exact opposite and we're turning the id into a mongoose model instance
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.googleClientID,
            clientSecret: process.env.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
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
