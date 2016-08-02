var app = require('../index');

// redirect routes to login page if no user is logged in
var isAuthenticated = function(request, response, next) {
  if (request.isAuthenticated())
    return next();
  response.redirect('/login');
};

module.exports = function(passport) {

  // app.get('/login', function(request, response) {
  //   if (request.user)
  //     response.redirect('/profile');
  //   response.render('passport/login');
  // });
  app.post('/login', passport.authenticate('login'), function(req, res) {
    res.json(req.user);
  });

  app.get('/loggedinuser', function (req, res) {
    console.log('Logged in user: ' + req.user);
    res.json(req.user);
  });

  // app.get('/signup', function(request, response) {
  //   if (request.user)
  //     response.redirect('/profile');
  //   response.render('passport/signup');
  // });
  app.post('/signup', passport.authenticate('signup'), function(req, res) {
    res.json(req.user);
  });

  // app.post('/signup', function(req, res, next) {
  //   passport.authenticate('signup', function(error, user) {
  //     console.log(user);
  //     console.log(error);
  //     res.json(user);
  //   })(req, res, next);
  // });

  // app.get('/loginsuccess', isAuthenticated, function(req, res) {
  //   // upon successful authentication req.user contains the authenticated user
  //   req.flash('success', 'Logged in as ' + req.user.username);
  //   res.redirect('/profile');
  // });

  // app.get('/logout', function(request, response) {
  //   request.logout();
  //   app.locals.username = null;
  //   response.redirect('/login');
  // });

  // app.get('/profile', isAuthenticated, function(req, res) {
  //   res.render('users/view', {
  //     own: true,
  //     title: 'Your Profile',
  //     user: req.user
  //   });
  // });
  //
  // app.get('/editprofile', isAuthenticated, function(req, res) {
  //   res.render('users/edit', {
  //     own: true,
  //     title: 'Edit your profile',
  //     user: req.user
  //   });
  // });

  return app;
}
