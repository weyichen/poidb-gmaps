var app = require('../index');

// redirect routes to login page if no user is logged in
var isAuthenticated = function(request, response, next) {
  if (request.isAuthenticated())
    return next();
  response.redirect('/login');
};

module.exports = function(passport) {

  app.post('/login', function(req, res, next) {
    if (!checkRequiredFields(req, res))
      return;

    // need to place callback within passport.authenticate call
    // if placed outside, will only be called if authentication is successful
    // if failed, POST to /login will return Forbidden status
    passport.authenticate('login', {session: true}, function(error, user) {
      if (!user) {
        res.json(req.flash().authError[0]);
        return;
      }
      req.login(user, function(err) {
        if (err) return next(err);
      });
      res.json(user);
    })(req, res, next);
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.json('logout ok');
  });

  app.get('/loggedinuser', function (req, res) {
    console.log('Logged in user: ' + req.user);
    res.json(req.user);
  });

  app.post('/signup', function(req, res, next) {
    if (!checkRequiredFields(req, res))
      return;

    passport.authenticate('signup', function(error, user) {
      if (!user) {
        res.json(req.flash().authError[0]);
        return;
      }
      req.login(user, function(err) {
        if (err) return next(err);
      });
      res.json(user);
    })(req, res, next);
  });

  return app;
}

function checkRequiredFields(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json("Missing username or password!");
    return false;
  }
  return true;
}
