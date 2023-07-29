const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

const app = express();

// Passport config
require('./passport')(passport);

// Body parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Initialize EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
// app.use(express.static('static'))
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/css', express.static(path.join(__dirname, 'css')))

// Check database connectivity
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
.then(() => {
    app.use('/', require('./routes/index'));
    app.use('/setup', require('./routes/setup'));
    app.use('/user', require('./routes/user'));
    app.use('/dashboard', require('./routes/dashboard'));
}).catch(err => {
    console.error('[DB] Connection error:\n' + err);
    app.use('/', require('./routes/db-config-error'));
});

const SERVER_PORT = process.env.SERVER_PORT || 80;

app.listen(SERVER_PORT, console.log(`[Server] Instance started on port ${SERVER_PORT}`));