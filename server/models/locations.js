var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var locationSchema = new Schema({
  title: String,
  lat: Number,
  lng: Number
})

var locationsSchema = new Schema({
  username: { type: String, required: true, unique: true },
  locations: [locationSchema]

});

var Locations = mongoose.model('Locations', locationsSchema);
module.exports = Locations;
