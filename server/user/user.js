var User = require('../models/user');

exports.list = function(req, res) {
  User.find({})
  .then(users => {
    for (user in users) {
      // don't return hashed passwords
      user.password = null;
    }
    res.json({users: users})
  })
  .catch(err => res.send(err));
};

exports.read = function(req, res) {
  User.findById(req.params.id)
    .then(user => {
      user.password = null;
      res.json({user: user})
    })
    .catch(() => {
      var err = 'Cannot find user ' + req.params.id;
      res.send(err);
    });
};

exports.update = function(req, res) {
  User.findById(req.params.id)
    .then(user => {
      for (var property in req.body) {
      if (req.body[property]) {
        user[property] = req.body[property];
        // prevents model from hashing an unchanged password
        if (property === 'password')
          user['mod_password'] = true;
      }
      }
      user.save()
        .then(user => res.json(user));
    })
    .then() // TODO: how to get promise from user.save here?
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


exports.getMap = function (req, res) {
  if (!req.user) {
    req.flash('info', 'Log in to view your saved map locations!');
    res.render('pages/map');
  }

  else {
    User.findById(req.user._id, function(err, user) {
      if (user) {
        res.render('pages/map', {locations: user.locations});
      }
      else {
        req.flash('error', 'cannot find user ' + req.params.id);
        res.render('pages/map');
      }
    });
  }
};


exports.getLocations = function(req, res) {
}

exports.addLocation = function(req, res) {

}

exports.editLocation = function(req, res) {

}

exports.deleteLocation = function(req, res) {

}

exports.debugmod = function(req, res) {
  User.findById(req.user._id, function(err, user) {
    if (user) {
      user.admin = true;

      //user.locations.push({ title: 'Sample Point', lat: 0, lng: 0 });

      user.save(function (err) {
        if (err) return handleError(err)
        console.log('Success!');
        res.redirect('/map');
      });
    } else {
      var err = new Error('cannot find user ' + req.params.id);
      err.status = 404;
      next(err);
    }
  });
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
