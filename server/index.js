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
app.set('port', 5000);
app.set('dbmode', 'mongodb'); // unused, currently only mongoDB
app.set('mongodb-uri', 'mongodb://heroku_jwmv0642:vsjp1seocg6di61eo4vv1hogei@ds015924.mlab.com:15924/heroku_jwmv0642');

app.set('views', __dirname + '/../public');
app.set('view engine', 'ejs');

/**
  ** DB CONNECTION **
**/
mongoose = require('mongoose');
// use the native promise library, as the mongoose mpromise library is deprecated
mongoose.promise = global.Promise;
mongoose.connect(app.get('mongodb-uri'), function (err) {
  if (err) console.log(err);
  console.log("connected to mongodb!");
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

// place all middleware before all routes

/**
  ** ROUTES **
  **/
app.use('/debug', require('./debug'));

app.use('/', routes);

// this catch all redirects all non-api routes to angular, so that the angular router can work!
app.get('*', function(req, res) {
  // ignore requests for non-existent files
  if (!path.extname(req.path)) {
    res.sendFile('index.html', {root: __dirname + '/../public/'});
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
