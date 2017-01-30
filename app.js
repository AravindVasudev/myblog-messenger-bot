const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

//Init App
const app = express();

//Routes
const index = require('./routes/index');

//Morgan
app.use(logger('dev'));

//Body Parser & Cookie Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Static Directories
app.use(express.static(path.join(__dirname, 'public')));

//Init Routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.json({
    error: 404
  });


});

module.exports = app;
