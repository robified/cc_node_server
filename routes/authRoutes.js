const passport = require('passport');

module.exports = (app) => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get('/auth/google/callback', passport.authenticate('google'));

    // this can be any route you want
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};
