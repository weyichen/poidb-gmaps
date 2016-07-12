var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var locationSchema = new Schema({
  title: String,
  lat: Number,
  lng: Number
});

var Location = mongoose.model('Location', locationSchema);
module.exports = Location;
