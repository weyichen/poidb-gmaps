var express = require('express');
var passport = require('passport');

var User = require('./models/user');

var router  = express.Router();

router.get('/', function(req, res) {
  User.find({})
    .then(users => {
      var username0 = users[0].username;
      console.log(username0);
      return User.findOne({username: username0}).exec();
    })
    .then(user => {
      console.log(user.username);
      return user.save();
    })
    .then(user => {
      console.log(user.username);
      res.json(user.username);
    })

})

/*
  unset unnecessary mongo document attribute
  note that Array and other types of properties with a specified default will still show up until the attribute is removed from the model
  however we must unset it here before removing it, else it will still be returned, but be unmodifiable
*/
router.get('/unset_att', function(req, res) {
  User.collection.update({}, { $unset: {mod_password: 1} }, {multi: true, safe: true, strict: false})
    .then(() => res.json('ok'));
})

module.exports = router;
