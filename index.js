const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

// "passport, i want you to be aware that there is a new strategy available"
// this create a new instance of the passport strategy
// "hey application, I want to somehow authenticate my users with Google"
// inside the constructor, we're going to pass in some configuration that tells GoogleStrategy how to authenticate users inside of the application
passport.use(
    // GoogleStrategy has an internal identified of 'google'
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            console.log('access token', accessToken);
            console.log('refresh token', refreshToken);
            console.log('profile', profile);
        }
    )
);

app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback', passport.authenticate('google'));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
