var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var locationSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	lat: Number,
	lng: Number
})

var mapSchema = new Schema({
	title: String,
	description: String,
	owners: [ String ],
	locations: [locationSchema]

});

var Map = mongoose.model('Map', mapSchema);
module.exports = Map;
