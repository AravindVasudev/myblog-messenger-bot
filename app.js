const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const mongoose     = require('mongoose');

//Init App
const app = express();

//Routes
const index = require('./routes/index');

//Configs
const DBConfig = require('./config/database.js');

//Mongoose Setup
mongoose.connect(DBConfig.url);
mongoose.Promise = global.Promise;

//Session Store
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

//Morgan
app.use(logger('dev'));

//Body Parser & Cookie Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Session
app.use(session({
  secret: 'shamballa',
  saveUninitialized: true,
  resave: true,
  store: sessionStore
}));

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
