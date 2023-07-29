const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            // Find user in database
            User.findOne({ username: username.toLowerCase() })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username or password.' });
                    }

                    // Check if user is enabled
                    if (!user.active) {
                        return done(null, false, { message: 'Account is disabled or unavailable.' });
                    }

                    // Check if password is correct
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {

                        } else if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Incorrect username address or password.' });
                        }
                    })
                })
                .catch(err => {
                    console.error('[DB] Read error:\n' + err);
                    return done(null, false, { message: 'Database error occurred. View console for details.' });
                });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
}