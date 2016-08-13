module.exports = function(user) {
  user.password = undefined;
  return user;
}
