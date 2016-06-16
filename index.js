var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');

app.set('port', (process.env.PORT || 5000));
app.set('local', 'LOCAL' in process.env);
app.set('dbmode', process.env.DBMODE);

// setup appropriate database for local or Heroku
var db, mongoose, pg, stormpath;
if (app.get('dbmode') === 'mongodb') {
  mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
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

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

// app.get('/dashboard', stormpath.loginRequired, function(req, res) {
//   res.send('You have reached the dashboard page! You must be logged in.');
// });

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

// app.get('/usermap', stormpath.loginRequired, function (request, response) {
//   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//     if (err) {
//       console.error(err);
//       response.render('pages/map');
//     }
//     else {
//       request.user.getCustomData(function(err, data) {
//         if (err) {
//           console.error(err); response.send("Error " + err);
//         }
//         else if (data.mappoints){
//           rescd ponse.render('pages/map', {results: data.mappoints} );
//         } else {
//           response.render('pages/map', {results: null});
//         }
//       })
//   }
// });
// })

// User
app.get('/users', user.list);
app.all('/user/:id/:op?', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

// app.on('stormpath.ready', function() {
//   app.listen(app.get('port'), function() {
//     console.log('Node app is running on port', app.get('port'));
//   });
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
