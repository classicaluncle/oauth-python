/* eslint-disable no-console */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




var app = express();

var mongoose = require('mongoose').set('debug', true),
    // eslint-disable-next-line no-unused-vars
    FetchToken = require('./models/FetchToken'),
    AuthToken = require('./models/AuthToken'),
    StateToken = require('./models/StateToken');


//connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Oauth',{useNewUrlParser: true});

mongoose.connection.on('connected', function(){
  console.log('successful database connection');
});

// view engine setup
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));


//register the routes
var routes = require('./routes/index');
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
