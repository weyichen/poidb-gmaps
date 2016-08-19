var Map = require('../models/map');

exports.list = function (req, res) {
	Map.find({})
		.then(maps => res.json({ ok: true, maps: maps }))
		.catch(err => res.send(err));
};

exports.new = function(req, res) {

}

exports.get = function(req, res) {
	console.log("in map get \n")
	Map.findById(req.params.id)
		.then(map => res.json({ ok: true, map: map }))
		.catch(err => res.send(err));
}

exports.edit = function(req, res) {
	console.log(req.body);
	Map.findById(req.params.id)
		.then(map => {
			for (var property in req.body) {
        		map[property] = req.body[property];
			}
			return map.save();
		})
		.then(user => res.json({ok: true}))
    	.catch(err => res.send({ok: false, err: err}));
}

exports.delete = function(req, res) {
	Map.findByIdAndRemove(req.params.id)
		.then(() => res.json({ ok: true }))
		.catch(err => res.send(err));
}

exports.debugmod = function(req, res) {
	Map.create({
		title: 'Test Map 1', 
		owners: [req.user._id],
		locations: [{title: 'Origin', lat: 0, lng: 0}] 
	});
}

