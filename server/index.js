/**
  ** IMPORT EXPRESS DEPENDENCIES **
**/
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
require('./config/passport');
var passport = require('passport');
var flash = require('connect-flash');
const path = require('path');

var app = express();
var routes = require('./routes');

/**
  ** CONFIG **
**/
const CF = require('./config');
app.set('production', process.env.PRODUCTION || CF.PRODUCTION_MODE);
app.set('port', process.env.PORT || CF.PORT);

app.set('views', __dirname + '/../public');
app.set('view engine', 'ejs');


var indexFile;
if (app.get('production')) {
  indexFile = "index.min.html";
} else {
  indexFile = 'index.html';
}

/**
  ** DB CONNECTION **
**/
mongoose = require('mongoose');
// use the native promise library, as the mongoose mpromise library is deprecated
mongoose.promise = global.Promise;
mongoose.connect(CF.MONGODB_URI, function (err) {
  if (err) console.log(err);
  else console.log("connected to mongodb!");
});


/**
  ** MIDDLEWARE **
**/
app.use('/static', express.static(__dirname + '/../public'));
app.use('/client', express.static(__dirname + '/../client'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this uses the mongoDB connection to maintain a persistent session
app.use(session({
  secret: CF.SESSION_SECRET,
  cookie : {
    maxAge: CF.COOKIE_MAXAGE
  },
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// place all middleware before all routes

/**
  ** ROUTES **
**/
if (!app.get('production')) {
  app.use('/debug', require('./debug'));
}

app.use('/', routes);

// this catch all redirects all non-api routes to angular, so that the angular router can work!
app.get('*', function(req, res) {
  // ignore requests for non-existent files
  if (!path.extname(req.path)) {
    res.sendFile(indexFile, {root: __dirname + '/../public/'});
  }
  else {
    res.status(404).end();
  }
});

/**
  ** START SERVER **
  **/
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
