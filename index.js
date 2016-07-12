var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');

var app = module.exports = express();
app.set('port', (process.env.PORT || 5000));
app.set('local', 'LOCAL' in process.env);
app.set('dbmode', process.env.DBMODE);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

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

var User = require('./models/user');

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

app.use(function(request, response, next) {
  if (request.user)
    app.locals.username = request.user.username;
  next();
});

// triage any flash messages
app.use(function(request, response, next) {
  var flash = request.flash();
  for (var grade in flash) {
    response.locals[grade+'Msgs'] = flash[grade].join('<br>');
  }
  next();
});

// DEBUG - log stuff
app.use(function(req, res, next) {
  //console.log(req.session);
  next();
});

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.get('/map', function (req, res) {
  if (!req.session.passport) {
    req.flash('info', 'Log in to view your saved map locations!');
    res.render('pages/map');
  }

  else {
    User.findById(req.session.passport.user, function(err, user) {
      if (user) {
        res.render('pages/map', {locations: user.locations});
      }

      else {
        req.flash('error', 'cannot find user ' + req.params.id);
        res.render('pages/map');
      }
    });
  }
});

app.get('/addmappoint', function (req, res) {
  User.findById(req.session.passport.user, function(err, user) {
    if (user) {
      user.locations.push({ title: 'Sample Point', lat: 0, lng: 0 });
      user.save(function (err) {
        if (err) return handleError(err)
        console.log('Success!');
        res.redirect('/map');
      });
    } else {
      var err = new Error('cannot find user ' + req.params.id);
      err.status = 404;
      next(err);
    }
  });

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
