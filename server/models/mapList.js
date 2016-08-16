var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mapListSchema = new Schema({
	user: { type: String, required: true, unique: true },
	own_maps: [ String ],
	saved_maps: [ String ]
})

var mapList = mongoose.model('MapList', mapListSchema);
module.exports = MapList;
