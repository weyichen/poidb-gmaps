var express = require('express');
var router = express.Router();

var user = require('./user');

router.get('/users', user.list);
router.all('/user/:id/:op?', user.load);
router.get('/user/:id', user.view);
router.get('/user/:id/view', user.view);
router.get('/user/:id/edit', user.edit);
router.get('/user/:id/delete', user.delete);

// ISSUE: HTML forms don't support PUT, you have to transform it server-side
router.post('/user/:id/edit', user.update);

router.get('/users/populate', user.populate);
router.get('/users/exterminate', user.exterminate);

module.exports = router;
