var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortly');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongo connection open');
});
module.exports = db;
