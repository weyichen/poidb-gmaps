var express = require('express');
var router = express.Router();

var user = require('./user');
var auth = require('./auth');
var map = require('./map');

router.use('/api/user', user);
router.use('/api/auth', auth);
router.use('/api/map', map);

module.exports = router;
