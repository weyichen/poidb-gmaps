var User = require('./models/user');

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

exports.populate = function() {
  for (var i = 0; i < users.length; i++) {
    users[i].save(function(err) {
      if (err) throw err;

      console.log(users[i].name + " created!");
    });
  }

}

exports.list = function(req, res){
  User.find({}, function(err, users) {
    if (err) throw err;

    res.render('users', { title: 'Users', users: users });
  });
};

exports.create = function(req, res) {

};



exports.load = function(req, res, next){
  var id = req.params.id;
  req.user = users[id];
  if (req.user) {
    next();
  } else {
    var err = new Error('cannot find user ' + id);
    err.status = 404;
    next(err);
  }
};

exports.view = function(req, res){
  res.render('users/view', {
    title: 'Viewing user ' + req.user.name,
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
