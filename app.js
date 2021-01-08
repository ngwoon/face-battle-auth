const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require("./models");
const jwt = require("./middlewares/jwt");

const verRouter = require('./routes/verification');
const regRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const findRouter = require('./routes/find');
const modRouter = require('./routes/modification');

const app = express();

// sequelize init
sequelize.sync();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




/*
    routers
*/

// app.use("/", indexRouter);
app.use("/verification", verRouter);
app.use("/registration", regRouter);
app.use("/login", loginRouter);
app.use("/find", authenticateUser, findRouter);
app.use("/password", authenticateUser, modRouter);



// 이후 요청은 권한 인증된 클라이언트들에게만 제공해야함
// 권한 확인 코드
function authenticateUser(req, res, next) {
    const retBody = {
        fail: {
            unauthenticatedClient: {
                resultCode: "400",
                resultMsg: "토큰이 존재하지 않음",
                item: {},
            },
            invalidToken: {
                resultCode: "401",
                resultMsg: "유효하지 않은 토큰",
                item: {},
            },
        },
    };

    if(req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if(token && jwt.verifyJWT(token))
            next();
        else
            res.status(401).json(retBody.fail.invalidToken);
    } else
        res.status(400).json(retBody.fail.unauthenticatedClient);
}









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
