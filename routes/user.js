const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/login', (req, res) => res.render('login', { layout: 'standard-layout' }));

// Handle login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

// Handle logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully logged out.');
    res.redirect('/user/login');
});

module.exports = router;