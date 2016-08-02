var express = require('express');
var router = express.Router();

var user = require('./user');

router.use(function(req, res, next) {
  // console.log('in user router');
  // console.log(req.path);
  next();
})

// check if the page belongs to the logged in user
router.use('/:id/:op?', function(req, res, next) {
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

// When called from a middleware, the mount point (/api/user) is not included in req.path
router.get('/list', user.list);
router.get('/:id', user.read);
router.put('/:id', user.update); // TODO: reimplement isAuthorized
router.delete('/:id', user.delete);  // TODO: reimplement isAuthorized

// TODO:
router.get('/map', user.getMap);
router.post('user/:id/addLocation', user.addLocation);
router.post('user/:id/:locID', user.editLocation);
router.delete('user/:id/:locID', user.deleteLocation);

router.get('/debugmod', user.debugmod);
router.get('/users/populate', user.populate);
router.get('/users/exterminate', user.exterminate);

module.exports = router;
