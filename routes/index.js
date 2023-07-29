const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.redirect('/user/login')); // TODO: In callback, check if anything is in users database and route to first user creation or login based on this

module.exports = router;