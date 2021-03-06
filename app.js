
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var elearingRouter = require('./routes/elearing');
var acaRouter = require('./routes/aca');
var APIRouter = require('./routes/API');

var app = express();

// view engine setup
var engine = require('ejs-locals');
var path = require('path');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('fiuhEweYoIlffho4983E7yro3S4lfuho798gfyhASLiudhoiGHo'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/cookie', indexRouter);

app.use('/', indexRouter);
app.use('/elearning', elearingRouter);
app.use('/aca', acaRouter);
app.use('/API', APIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app