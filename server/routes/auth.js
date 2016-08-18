var express = require('express');
var passport = require('passport');

var trimUserObject = require('../controllers').trimUserObject;

var router = express.Router();

router.post('/login', function(req, res, next) {
  if (!checkRequiredFields(req, res))
    return next();

  usePassportStrategy(passport, 'login', req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.json({ logged_out: true });
});

router.get('/loggedinuser', function (req, res) {
  console.log('/loggedinuser')
  if (req.user)
    res.json({ logged_in: true, user: req.user });
  else
    res.json({ logged_in: false });
});

// TODO: temporary workaround for edit-profile module
router.get('/loggedinuser2', function (req, res) {
  console.log('/loggedinuser2')
  if (req.user)
    res.json({ logged_in: true, user: req.user });
  else
    res.json({ logged_in: false });
});

router.post('/signup', function(req, res, next) {
  if (!checkRequiredFields(req, res))
    return next();

  usePassportStrategy(passport, 'signup', req, res, next);
});

module.exports = router;

/**
  ** HELPERS **
**/

function checkRequiredFields(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({ logged_in: false, error: "Missing username or password!" });
    return false;
  }
  return true;
}

function usePassportStrategy(passport, strategy, req, res, next) {
  // need to place callback within passport.authenticate call
  // if placed outside, will only be called if authentication is successful
  // if failed, POST to /login will return Forbidden status
  passport.authenticate(strategy, function(error, user) {
    if (!user) {
      res.json({ logged_in: false, error: req.flash().authError[0] });
      return next();
    }
    user = trimUserObject(user);

    req.login(user, function(err) {
      if (err) 
        res.json({ logged_in: false, error: err });
      else {
        res.json({ logged_in: true, user: req.user });
      }
      return next();
    });

  })(req, res, next);
}
