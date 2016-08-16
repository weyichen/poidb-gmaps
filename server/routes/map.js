var express = require('express');
var router = express.Router();

var map = require('../controllers/map');

var isAuthorized = function(req, res, next) {
  if (res.locals.own || res.locals.admin)
    return next();
  res.status(403).send('Not authorized.');
};

router.get('/debug', map.debugmod);

router.get('/list', map.list);
router.post('/new', map.new);
router.get('/:id', map.get);
router.put('/:id', map.edit);
router.delete('/:id', map.delete);



// TODO:
// router.get('/map', user.getMap);
// router.post('user/:id/addLocation', user.addLocation);
// router.post('user/:id/:locID', user.editLocation);
// router.delete('user/:id/:locID', user.deleteLocation);
//
// router.get('/debugmod', user.debugmod);
// router.get('/users/populate', user.populate);
// router.get('/users/exterminate', user.exterminate);

module.exports = router;
