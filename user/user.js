var User = require('../models/user');

// Fake user database
var users = [];
users[0] = new User({
  username: 'tj',
  password: 'homelessspa',
  name: 'TJ',
  email: 'tj@vision-media.ca'
});
users[1] = new User({
  username: 'tobi',
  password: 'isagoodboy',
  name: 'Tobi',
  email: 'tobi@vision-media.ca'
});

exports.populate = function(req, res) {
  User.create(users, function (err, addedUsers) {
    if (err) {
      if (err.code === 11000) // handle duplicates
        console.log('username already exists! ignoring...');
      else
        throw err;
    }
    res.redirect('/users');
  });
};

exports.list = function(req, res){
  User.find({}, function(err, users) {
    if (err) throw err;

    res.render('users', { title: 'Users', users: users });
  });
};

exports.load = function(req, res, next){
  User.findById(req.params.id, function(err, user) {
    req.user = user;
    if (req.user) {
      console.log(req.params.id);
      next();
    } else {
      var err = new Error('cannot find user ' + req.params.id);
      err.status = 404;
      next(err);
    }
  });
};

exports.view = function(req, res){
  res.render('users/view', {
    title: 'Viewing user ' + req.user.username,
    user: req.user
  });
};

exports.edit = function(req, res){
  res.render('users/edit', {
    title: 'Editing user ' + req.user.name,
    user: req.user
  });
};

exports.update = function(req, res){
  // Normally you would handle all kinds of
  // validation and save back to the db
  var user = req.body.user;
  req.user.name = user.name;
  req.user.email = user.email;
  res.redirect('back');
};

exports.exterminate = function(req, res){
  User.remove({}, function (err) {
    if (err) throw err;
    res.redirect('/users');
  });
};
