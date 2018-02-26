'use strict'
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '12345',
  cookie: {maxAge: 80000 },
  resave: true,
  saveUninitialized: true,
  unset:'keep'
}));

console.log("成功监听8080端口")
app.listen(8002);

