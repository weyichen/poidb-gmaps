var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  admin: Boolean,
  created_at: Date,
  updated_at: Date,

  locations: [{ title: String, lat: Number, lng: Number }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
