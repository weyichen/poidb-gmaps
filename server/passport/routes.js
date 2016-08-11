var app = require('../index');

module.exports = function(passport) {

  const apiBase = '/api/auth';

  app.post(apiBase + '/login', function(req, res, next) {
    if (!checkRequiredFields(req, res))
      return next();

    usePassportStrategy(passport, 'login', req, res, next);
  });

  app.get(apiBase + '/logout', function(req, res) {
    req.logout();
    res.json({ logged_out: true });
  });

  app.get(apiBase + '/loggedinuser', function (req, res) {
    console.log('/loggedinuser')
    if (req.user)
      res.json({ logged_in: true, user: req.user });
    else
      res.json({ logged_in: false });
  });

  // TODO: temporary workaround for edit-profile module
  app.get(apiBase + '/loggedinuser2', function (req, res) {
    console.log('/loggedinuser2')
    if (req.user)
      res.json({ logged_in: true, user: req.user });
    else
      res.json({ logged_in: false });
  });

  app.post(apiBase + '/signup', function(req, res, next) {
    if (!checkRequiredFields(req, res))
      return next();

    usePassportStrategy(passport, 'signup', req, res, next);
  });

  return app;
}


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
    // don't store hashed password in request user object
    user.password = null;
    req.login(user, function(err) {
      if (err) return next(err);
    });
    res.json({ logged_in: true, user: req.user });
    return next();
  })(req, res, next);
}
