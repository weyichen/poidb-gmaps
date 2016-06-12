var express = require('express');
var app = express();
var pg = require('pg');
var stormpath = require('express-stormpath');
var cool = require('cool-ascii-faces');

pg.defaults.ssl = true;

app.set('port', (process.env.PORT || 5000));

app.use(stormpath.init(app, { cache: 'memory' }));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.send('You have reached the dashboard page! You must be logged in.');
});

app.get('/cool', function(request, response) {
  response.send(cool());
})

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
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
})

app.get('/map', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      console.error(err);
      response.render('pages/map');
    }
    else {
      client.query('SELECT * FROM map', function(err, result) {
        done();
        if (err) {
          console.error(err); response.send("Error " + err);
        }
        else {
          response.render('pages/map', {results: result.rows} );
        }
    });
  }
});
})

app.get('/usermap', stormpath.loginRequired, function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      console.error(err);
      response.render('pages/map');
    }
    else {
      request.user.getCustomData(function(err, data) {
        if (err) {
          console.error(err); response.send("Error " + err);
        }
        else if (data.mappoints){
          response.render('pages/map', {results: data.mappoints} );
        } else {
          response.render('pages/map', {results: null});
        }
      })
  }
});
})

app.on('stormpath.ready', function() {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
});
