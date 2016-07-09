var app = require('../index');

// routes below are redirected to login page if no user is logged in
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
  app.get('/loginsuccess', function(request, response) {
    app.locals.username = request.user.username;
    response.redirect('/user/' + request.session.passport.user);
  });

  app.get('/logout', function(request, response) {
    request.logout();
    app.locals.username = null;
    response.redirect('/login');
  });

  app.get('/profile', isAuthenticated, function(request, response) {
    response.redirect('/user/' + request.session.passport.user);
  });

  return app;
}
