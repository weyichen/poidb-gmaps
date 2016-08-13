
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
