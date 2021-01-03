const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require("./models");

const verRouter = require('./routes/verification');
const regRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const findRouter = require('./routes/find');
const modRouter = require('./routes/modification');
const indexRouter = require("./routes/index");

const app = express();

// sequelize init
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/verification", verRouter);
app.use("/verification-email", verRouter);
app.use("/registration", regRouter);
app.use("/login", loginRouter);
app.use("/find", findRouter);
app.use("/password", modRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
}); 

// error handler
app.use(function(err, req, res, next) {

  console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
