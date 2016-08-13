var express = require('express');
var router = express.Router();

var user = require('./user');
var auth = require('./auth');
var locations = require('./locations');

router.use('/api/user', user);
router.use('/api/auth', auth);
router.use('/api/locations', locations);

module.exports = router;
