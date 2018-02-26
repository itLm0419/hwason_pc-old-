'use strict'
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mutipart= require('connect-multiparty');



var app = express();

app.use(mutipart({uploadDir:'./temp'}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
  secret: '12345',
  cookie: {maxAge: 80000 },
  resave: true,
  saveUninitialized: true,
  unset:'keep'
}));
//require('../dist/server/util/logHelper').use(app);
require('../dist/server/index')(app);
app.listen(5555,function (err) {
  console.log("成功监听5555端口");
});


