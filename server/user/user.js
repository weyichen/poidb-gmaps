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

exports.list = function(req, res) {
  User.find({}, function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.read = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (user) {
      res.json(user);
    } else {
      var err = new Error('cannot find user ' + req.params.id);
      err.status = 404;
      res.send(err);
    }
  });
};


exports.update = function(req, res) {
  var user = req.lookupUser;
      for (var property in req.body) {
        if (req.body[property])
          user[property] = req.body[property];
      }
      user.save(function(error, user) {
        if (err) {
          res.send(err);
        }
        else {
          res.json('update success');
        }
      }); // ISSUE:  Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
      // https://github.com/Automattic/mongoose/wiki/5.0-Deprecation-Warnings
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
