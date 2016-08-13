var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
  function(req, username, password, done) {
    console.log("authenticating as " + username);
    User.findOne({ 'username': username }, function (err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, req.flash('authError', 'You are not yet registered.'));
      if (!bcrypt.compareSync(password, user.password))
        return done(null, false, req.flash('authError', 'Incorrect username or password.'));
      return done(null, user);
    });
  }
));

passport.use('signup', new LocalStrategy({
  passReqToCallback: true
},
  function(req, username, password, done) {
    console.log("registering as " + username);
    User.create({ 'username': username, 'password': bcrypt.hashSync(password) }, function (err, user) {
      if (err) {
        if (err.code === 11000) // handle duplicates
          return done(null, false, req.flash('authError', 'This username has been taken. Please try another.'));
        return done(err);
      }
      console.log('Registered as ' + user.username);
      return done(null, user);
    });
  }
));
