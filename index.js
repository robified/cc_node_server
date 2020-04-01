const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(
    cookieSession({
        // how long can a cookie exist in the browser before it expires 30 days has to be passed in as miliseconds
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // this will be used to encrypt our cookie, so people can't manually change the user is and fake being someone else
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
