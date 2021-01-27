const dotenv = require("dotenv");
const path = require('path');

if(process.env.NODE_ENV === "development") {
    console.log("NODE_ENV is development");
    dotenv.config({ path: path.join(__dirname, "/env/development.env")});
} else if(process.env.NODE_ENV === "production") {
    console.log("NODE_ENV is production");
    dotenv.config({ path: path.join(__dirname, "/env/production.env")});
} else {
    console.log("NODE_ENV를 찾을 수 없습니다.");
    process.exit(1);
}


const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require("./models");
const { authenticateUser } = require("./middlewares/auth");

const indexRouter = require("./routes/index");
const verRouter = require('./routes/verification');
const regRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const findRouter = require('./routes/find');
const modRouter = require('./routes/modification');
const imagesRouter = require('./routes/images');


const app = express();


// sequelize init
sequelize.sync();


app.use(logger(process.env.LOGGER_MODE));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.set('view engine', "jade");


/*
    routers
*/
app.use("/", indexRouter);
app.use("/verification", verRouter);
app.use("/registration", regRouter);
app.use("/login", loginRouter);
app.use("/find", findRouter);
app.use("/password", authenticateUser, modRouter);
app.use("/images", authenticateUser, imagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
}); 

// error handler
app.use(function(err, req, res, next) {

    // console.log(err);

    // // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // // render the error page
    // res.status(err.status || 500);
    // res.render('error');

    res.status(err.resultCode || err.status).json(err);
});

module.exports = app;
