var express = require('express');
var router = express.Router();

var user = require('./user');

// check if the page belongs to the logged in user
router.use('/user/:id/:op?', function(req, res, next) {
  if (req.user && req.params.id) {
    if (req.user._id == req.params.id) { // use == cause req.user._id is an object while params.id is a string
      res.locals.own = true;
    }
    if (req.user.admin) {
      res.locals.admin = true;
    }
  }
  return next();
});

var isAuthorized = function(req, res, next) {
  if (res.locals.own || res.locals.admin)
    return next();
  res.status(403).send('You are not authorized to view this page!');
};

router.get('/users', user.list);
router.all('/user/:id/:op?', user.read);
router.get('/user/:id', user.read);
router.get('/user/:id/view', user.read);
router.get('/user/:id/edit', isAuthorized, user.read);
router.post('/user/:id/edit', isAuthorized, user.update); // ISSUE: HTML forms don't support PUT, you have to transform it server-side
router.get('/user/:id/delete', isAuthorized, user.delete);

router.get('/map', user.getMap);
router.post('user/:id/addLocation', user.addLocation);
router.post('user/:id/:locID', user.editLocation);
router.delete('user/:id/:locID', user.deleteLocation);

router.get('/debugmod', user.debugmod);
router.get('/users/populate', user.populate);
router.get('/users/exterminate', user.exterminate);

module.exports = router;
