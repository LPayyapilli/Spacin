require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var express_session = require('express-session');
var mongoose = require('mongoose');
var config = require('./config');


var app = express();
mongoose.connect(config.mongo.dbUrl);

app.use(cors({origin:'http://lpayyapilli.github.io', credentials: true}));

// app.use(cors({origin:'http://localhost:5000', credentials: true}));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('helloWorld'));
app.use(express_session({secret: 'helloWorld', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

/* Routing for each model */
var initPassport = require('./passport/init');
initPassport(passport);

/* Login Routes */
var loginRoute = require('./routes/auth.js')(passport);
app.use('/auth', loginRoute);

/* User Routes */
var userRoutes = require('./routes/users.js');
app.use('/user', userRoutes);

/* Space Routes */
var spaceRoutes = require('./routes/spaces.js');
app.use('/space', spaceRoutes);

/* Delete Routes */
var deleteRoutes = require('./routes/delete.js');
app.use('/delete', deleteRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});




module.exports = app;
