var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username cannot be blank!'],
    unique: [true, 'Username already exists!']
  },
  password: { type: String, required: true },
  mod_password: Boolean, // only hash password when it is modified
  name: String,
  email: String,
  admin: Boolean,
  created_at: Date,
  updated_at: Date,

  locations: [{ title: String, lat: Number, lng: Number }]
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;

  if (this.mod_password)
    this.password = bcrypt.hashSync(this.password);
  this.mod_password = false;
  next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;
