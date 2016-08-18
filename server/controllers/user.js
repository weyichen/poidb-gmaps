var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');
var trimUserObject = require('../controllers').trimUserObject;

exports.list = function(req, res) {
  User.find({})
  .then(users => {
    for (var i = 0; i < users.length; i++) {
      users[i] = trimUserObject(users[i]);
    }
    res.json({users: users})
  })
  .catch(err => res.send(err));
};

exports.findUserByUsername = function(req, res) {
  User.findOne({username: req.params.username})
    .then(user => {
      user = trimUserObject(user);
      res.json({user: user});
    })
    .catch(() => {
      var err = 'Cannot find user ' + req.params.id;
      res.send(err);
    });
}

exports.read = function(req, res) {
  User.findById(req.params.id)
    .then(user => {
      user = trimUserObject(user);
      res.json({user: user});
    })
    .catch(() => {
      var err = 'Cannot find user ' + req.params.id;
      res.send(err);
    });
};

exports.update = function(req, res) {
  console.log('req.body: ' + JSON.stringify(req.body));

  User.findById(req.params.id)
    .then(user => {
      for (var property in req.body) {
        user[property] = req.body[property];

        // leave the password unchanged if the field is blank
        if (property === 'password' && user[property] !== "")
          user['password'] = bcrypt.hashSync(user['password']);
      }
      // returning user.save().exec() - an actual promise, doesn't work here
      return user.save();
    })
    .then(user => res.json(user))
    .catch(err => res.send(err));
};

exports.delete = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(error, user) {
    if (error) {
      res.send(err);
    }
    else
      res.json('delete success');
  });
}

exports.promoteToAdmin = function(req, res) {
  if (req.params.password !== 'topsecret') {
    res.json('incorrect promotion password!');
    return;
  }

  User.findById(req.params.id)
    .then(user => {
      user.admin = true;
      user.save()
        .then(user => res.json(user));
    })
    .catch(err => res.send(err));
}

exports.demoteAdmin = function(req, res) {
  if (req.params.password !== 'topsecret') {
    res.json('incorrect demotion password!');
    return;
  }

  User.findById(req.params.id)
    .then(user => {
      user.admin = false;
      user.save()
        .then(user => res.json(user));
    })
    .catch(err => res.send(err));
}


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

exports.exterminate = function(req, res){
  User.remove({}, function (err) {
    if (err) throw err;
    res.redirect('/users');
  });
};
