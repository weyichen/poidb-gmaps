var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var cool = require('cool-ascii-faces');

var app = express();
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

var user = require('./user');
var User = require('./models/user');

var passportAuth = require('./passport/authentication');
passportAuth(passport);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
  console.log(request.session);
});

app.get('/login', function(request, response) {
  response.render('pages/login');
});
app.post('/login', passport.authenticate(
  'login', {  successRedirect: '/',
              failureRedirect: '/login',
              failureFlash: true }
));

app.get('/profile', function(request, response) {
  response.redirect('/user/' + request.session.passport.user);
});

app.get('/map', function (request, response) {

});

// User
app.get('/users', user.list);
app.all('/user/:id/:op?', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

app.get('/users/populate', user.populate);
app.get('/users/exterminate', user.exterminate);


app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/times', function(request, response) {
    var result = '';
    var times = process.env.TIMES || 5;
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err)
     { console.error(err); response.send("Error " + err); }
     else {
      client.query('SELECT * FROM test_table', function(err, result) {
        done();
        if (err)
         { console.error(err); response.send("Error " + err); }
        else
         { response.render('pages/db', {results: result.rows} ); }
      });
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
