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
    req.lookupUser = user;
    if (req.lookupUser) {
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
    title: 'Viewing user ' + req.lookupUser.username,
    user: req.lookupUser
  });
};

exports.edit = function(req, res){
  res.render('users/edit', {
    title: 'Editing user ' + req.lookupUser.name,
    user: req.lookupUser
  });
};

exports.update = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (user) {
      for (var property in req.body) {
        if (req.body[property])
          user[property] = req.body[property];
      }
      user.save(function(error) {
        if (error) {
          req.flash('error', error.errmsg);
          console.log(error.errmsg);
        }
        else
          console.log('edited user ' + user.username);
        res.redirect('back');
      }); // ISSUE:  Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
    }
  });

};

exports.delete = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(error, user) {
    if (error) {
      req.flash('error', error.errmsg);
      console.log(error.errmsg);
    }
    else
      console.log('deleted user ' + user.username);
    res.redirect('/');
  });
}

exports.exterminate = function(req, res){
  User.remove({}, function (err) {
    if (err) throw err;
    res.redirect('/users');
  });
};
