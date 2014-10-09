var crypto = require('crypto');
var mongoose = require('mongoose');


var linkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: {type: Date, default: Date.now}
});

var Link = mongoose.model('Link', linkSchema, 'Links');

var createShortcode = function(url, userId){
  var sha = crypto.createHash('sha1');
  sha.update(url);
  //sha.update(userId);
  return sha.digest('base64').slice(0,5);
};

linkSchema.pre('save', function(next){
  if (!this.code){
    this.code = createShortcode(this.url, this.userId);
  }
  next();
});

module.exports = Link;
