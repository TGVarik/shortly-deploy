var request = require('request');
var util = require('../lib/utility');

var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find()
      .where({userId: req.session.user._id})
      .exec(function(err, links) {
    if (err) {
      res.send(500, err);
    } else {
      res.send(200, links);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({url: uri})
      //.where({userId: req.session.user._id})
      .exec(function(err, link){
        if (err) {
          res.send(500, err)
        } else if (link) {
          res.send(200, link);
        } else {
          util.getUrlTitle(uri, function(err, title) {
            if (err) {
              console.log('Error reading URL heading: ', err);
              return res.send(404);
            } else {
              link = new Link({
                url     : uri,
                title   : title,
                base_url: req.headers.origin
                //,userId: req.session.user._id
              });
              link.save(function (err, newLink) {
                if (err) {
                  res.send(500, err)
                } else {
                  res.send(200, newLink);
                }
              });
            }
          });
        }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
      .exec(function(err, user){
        if (err) {
          res.send(500, err);
        }
        if (!user) {
          res.redirect('/login');
        } else {
          user.comparePassword(password, function(match) {
            if (match) {
              util.createSession(req, res, user);
            } else {
              res.redirect('/login');
            }
          })
        }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
      .exec(function(err, user){
        if (err){
          res.send(500, err);
        }
        if (!user) {
          var newUser = new User({
            username: username,
            password: password
          });
          newUser.save(function(err, newUser) {
              if (err) {
                res.send(500, err);
              }
              util.createSession(req, res, newUser);
            });
        } else {
          console.log('Account already exists');
          res.redirect('/signup');
        }
    });
};

exports.navToLink = function(req, res) {
  Link
  .findOne({ code: req.params[0] })
  .exec(function(err, link) {
    if (err) {
      res.send(500, err);
    } else if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      console.log(link);
      link
        .save(function(err) {
          if (err) {
            res.send(500,  err);
          }
          res.redirect(link.url);
        });
    }
  });
};
