const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('db-config-error', { layout: 'standard-layout' }));

module.exports = router;