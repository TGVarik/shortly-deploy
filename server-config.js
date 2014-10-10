var express = require('express');
var partials = require('express-partials');
var util = require('./lib/utility');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var handler = require('./lib/request-handler');

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: "hN.Xp3FC8q6G%bo9qnaP",
  saveUninitialized: true,
  resave: true
}));


app.get('/', util.checkUser, handler.renderIndex);
app.get('/create', util.checkUser, handler.renderIndex);

app.get('/links', util.checkUser, handler.fetchLinks);
app.post('/links', handler.saveLink);

app.get('/login', handler.loginUserForm);
app.post('/login', handler.loginUser);
app.get('/logout', handler.logoutUser);

app.get('/signup', handler.signupUserForm);
app.post('/signup', handler.signupUser);

app.get('/*', handler.navToLink);

module.exports = app;
