var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {type: String, unique: true},
  password: String,
  createdAt: {type: Date, default: Date.now}
});

var User = mongoose.model('User', userSchema, 'Users');

userSchema.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null)
      .bind(this)
      .then(function(hash){
        this.password = hash;
        next();
      });
});

User.prototype.comparePassword = function(passwordAttempt, callback){
  bcrypt.compare(passwordAttempt, this.password, function(err, isMatch) {
      callback(isMatch);
    });
};

module.exports = User;
