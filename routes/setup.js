const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');
const mongoose = require('mongoose');
require('dotenv').config();

router.get('/create-first-user', (req, res) => res.render('create-first-user', { layout: 'standard-layout' }));

// Handle first user creation
router.post('/create-first-user', (req, res) => {
    const { username, password, verifyPassword } = req.body;

    let errors = [];

    // Check for required fields
    if (!username || !password || !verifyPassword) {
        errors.push({ msg: 'Please fill in all fields.' });
    }

    // Check that passwords match
    if (password !== verifyPassword) {
        errors.push({ msg: 'Passwords must match.' });
    }

    if (errors.length > 0) { // Cancel action due to failed validation
        res.render('create-first-user', {
            layout: 'standard-layout',
            errors,
            username
        });
    } else { // Add first user and admin group to database
        mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
            .then(() => {
                User.countDocuments({}) // Check to make sure users collection is empty
                    .then(count => {
                        if (count > 0) {
                            res.redirect('/user/login');
                        } else {
                            UserGroup.findOne({ name: 'Administrators' }) // Check to make sure that admin group doesn't already exist
                                .then(group => {
                                    if (group) {
                                        res.redirect('/user/login');
                                    } else {
                                        const adminGroup = new UserGroup({
                                            name: 'Administrators',
                                        });
                                        const usernameLowercase = username.toLowerCase();
                                        const newUser = new User({
                                            username: usernameLowercase,
                                            password: password,
                                            groups: [adminGroup._id] });
                                        adminGroup.users = [newUser._id];
                                        adminGroup.save() // Save admin group to database
                                            .then(group => {
                                                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => { // Hash password
                                                    if (err) {
                                                        console.error('[Auth] Hash generation error:\n' + err);
                                                        errors.push({ msg: 'Internal error occurred. View console for details.' });
                                                        res.render('create-first-user', {
                                                            layout: 'standard-layout',
                                                            errors,
                                                            username
                                                        });
                                                    } else {
                                                        newUser.password = hash;
                                                        newUser.save() // Save first user to database with hashed password
                                                            .then(user => {
                                                                req.flash('success_msg', 'User created successfully. You may now log in with those credentials.');
                                                                res.redirect('/user/login');
                                                            })
                                                            .catch(err => {
                                                                console.error('[DB] Write error:\n' + err);
                                                                errors.push({ msg: 'Database error occurred. View console for details.' });
                                                                res.render('create-first-user', {
                                                                    layout: 'standard-layout',
                                                                    errors,
                                                                    username
                                                                });
                                                            });
                                                    }
                                                }));
                                            })
                                            .catch(err => {
                                                console.error('[DB] Write error:\n' + err);
                                                errors.push({ msg: 'Database error occurred. View console for details.' });
                                                res.render('create-first-user', {
                                                    layout: 'standard-layout',
                                                    errors,
                                                    username
                                                });
                                            });
                                    }
                                })
                                .catch(err => {
                                    console.error('[DB] Read error:\n' + err);
                                    errors.push({ msg: 'Database error occurred. View console for details.' });
                                    res.render('create-first-user', {
                                        layout: 'standard-layout',
                                        errors,
                                        username
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        console.error('[DB] Read error:\n' + err);
                        errors.push({ msg: 'Database error occurred. View console for details.' });
                        res.render('create-first-user', {
                            layout: 'standard-layout',
                            errors,
                            username
                        });
                    });
            })
            .catch(err => {
                console.error('[DB] Connection error:\n' + err);
                errors.push({ msg: 'Database error occurred. View console for details.' });
                res.render('create-first-user', {
                    layout: 'standard-layout',
                    errors,
                    username
                });
            });
    }
});

module.exports = router;