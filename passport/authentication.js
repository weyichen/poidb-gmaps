var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

module.exports = function(passport) {

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
          return done(null, false, {message: 'You are not yet registered!'});
        if (!bcrypt.compareSync(password, user.password))
          return done(null, false, {message: 'Incorrect password.'});
        return done(null, user, {message: 'logged in as' + user.username});
      });
    }
  ));
}
