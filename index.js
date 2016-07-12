var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var app = module.exports = express();
app.set('port', (process.env.PORT || 5000));
app.set('local', 'LOCAL' in process.env);
app.set('dbmode', process.env.DBMODE);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// setup appropriate database for local or Heroku
var db, mongoose, pg, stormpath;
if (app.get('dbmode') === 'mongodb') {
  mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI, function (err) {
    if (err) { console.log(err); return; }
    console.log("connected to mongodb!");
  });
}
else if (app.get('dbmode') === 'pg') {
  pg = require('pg');
  pg.defaults.ssl = true;
}
else if (app.get('dbmode') === 'stormpath'){
  // stormpath = require('express-stormpath');
  // app.use(stormpath.init(app, { cache: 'memory' }));
}

var user = require('./user/user');
var userRoutes = require('./user/routes');
app.use(userRoutes);

// set up passport strategies and authentication routes
var passportAuth = require('./passport/passport');
passportAuth(passport);
var authRoutes = require('./passport/routes');
authRoutes(passport);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// triage any flash messages
app.use(function(request, response, next) {
  var flash = request.flash();
  for (var grade in flash) {
    response.locals[grade+'Msgs'] = flash[grade].join('<br>');
  }
  next();
});

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.get('/map', function (request, response) {
  response.render('pages/map');
});

app.get('/debug', function (request, response) {
  console.log(request.user);
  console.log(request.session);
  response.redirect('/');
});

// User


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
