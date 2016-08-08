var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
const path = require('path');

var app = module.exports = express();

app.set('port', 5000);
app.set('dbmode', 'mongodb');
app.set('mongodb-uri', 'mongodb://heroku_jwmv0642:vsjp1seocg6di61eo4vv1hogei@ds015924.mlab.com:15924/heroku_jwmv0642');

app.set('views', __dirname + '/../public');
app.set('view engine', 'ejs');

// setup appropriate database for local or Heroku
var db, mongoose, pg, stormpath;
if (app.get('dbmode') === 'mongodb') {
  mongoose = require('mongoose');
  mongoose.promise = global.Promise; // use ES6 promise library
  mongoose.connect(app.get('mongodb-uri'), function (err) {
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

// MIDDLEWARES

app.use('/static', express.static(__dirname + '/../public'));
app.use('/client', express.static(__dirname + '/../client'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'keyboard cat',
  cookie : {
    maxAge: 3600000
  },
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// get username for rendering
app.use(function(request, response, next) {
  if (request.user)
    app.locals.username = request.user.username;
  else
    // remove username if user has logged out
    app.locals.username = null;
  next();
});

// triage any flash messages
app.use(function(request, response, next) {
  var flash = request.flash();
  for (var grade in flash) {
    response.locals[grade+'Msgs'] = flash[grade].join('\n');
  }
  next();
});

// DEBUG - log stuff
app.use(function(req, res, next) {
  //console.log("URL: " + req.originalUrl);
  next();
});

// place all middleware before all routes
// ROUTES

var User = require('./models/user');

var user = require('./user/user');
var userRoutes = require('./user/routes');
app.use('/api/user', userRoutes);

// set up passport strategies and authentication routes
require('./passport/passport')(passport);
require('./passport/routes')(passport);

app.get('/debug', function (req, res) {
  res.locals.debug = "hello debug!";
  res.render('views/pages/debug');
});

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname + '/../public/'});
});

// bottom catch-all to redirect all Angular app routes to the Angular router
app.get('*', function(req, res) {
  // ignore requests for non-existent files
  if (!path.extname(req.path)) {
    res.sendFile('index.html', {root: __dirname + '/../public/'});
  }
  else {
    res.status(404).end();
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
