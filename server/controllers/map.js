var Map = require('../models/map');

exports.list = function (req, res) {
  Map.find({}).exec()
    .then(maps => res.json({ ok: true, maps: maps }))
    .catch(error => res.json({ ok: false, error: error }));
};

exports.new = function(req, res) {
  // TODO
}

exports.get = function(req, res) {
  Map.findById(req.params.id).exec()
    .then(map => res.json({ ok: true, map: map }))
    .catch(error => res.json({ ok: false, error: error }));
}

exports.edit = function(req, res) {
  Map.findById(req.params.id).exec()
    .then(map => {
      for (var property in req.body) {
        map[property] = req.body[property];
      }
      return map.save();
    })
    .then(user => res.json({ ok: true }))
    .catch(error => res.json({ ok: false, error: error }));
}

exports.delete = function(req, res) {
  Map.findByIdAndRemove(req.params.id).exec()
    .then(() => res.json({ ok: true }))
    .catch(error => res.json({ ok: false, error: error }));
}

exports.debugmod = function(req, res) {
  Map.create({
    title: 'Test Map 1', 
    owners: [req.user._id],
    locations: [{title: 'Origin', lat: 0, lng: 0}] 
  });
}

