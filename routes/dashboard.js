const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../auth');

router.get('/', ensureAuthenticated, (req, res) => res.render('dashboard', { layout: 'dashboard-layout' }));

module.exports = router;