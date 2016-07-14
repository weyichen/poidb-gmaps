var app = require('../index');

// redirect routes to login page if no user is logged in
var isAuthenticated = function(request, response, next) {
  if (request.isAuthenticated())
    return next();
  response.redirect('/login');
};

module.exports = function(passport) {

  app.get('/login', function(request, response) {
    if (request.user)
      response.redirect('/profile');
    response.render('passport/login');
  });
  app.post('/login', passport.authenticate(
    'login', {  successRedirect: '/loginsuccess',
                failureRedirect: '/login',
                failureFlash: true }
  ));

  app.get('/signup', function(request, response) {
    if (request.user)
      response.redirect('/profile');
    response.render('passport/signup');
  });
  app.post('/signup', passport.authenticate(
    'signup', { successRedirect: '/loginsuccess',
                failureRedirect: '/signup',
                failureFlash: true }
  ));
  app.get('/loginsuccess', function(req, res) {
    // upon successful authentication req.user contains the authenticated user
    req.flash('success', 'Logged in as ' + req.user.username);
    res.redirect('/user/' + req.user._id);
  });

  app.get('/logout', function(request, response) {
    request.logout();
    app.locals.username = null;
    response.redirect('/login');
  });

  app.get('/profile', isAuthenticated, function(request, response) {
    response.redirect('/user/' + request.user._id);
  });

  return app;
}
