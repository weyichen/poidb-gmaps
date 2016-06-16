var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  admin: Boolean,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

  locations: [{ title: String, lat: Number, lng: Number }]
});

// userSchema.pre('save', function(next) {
//   var current
// })

var User = mongoose.model('User', userSchema);

module.exports = User;
