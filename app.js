var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const cors = require('cors');

var authRouter = require('./routes/auth/router');
var productsRouter = require('./routes/product/router');
var categoriesRouter = require('./routes/category/router');
var suppliersRouter = require('./routes/supplier/router');
const customersRouter = require('./routes/customer/router');
const employeesRouter = require('./routes/employee/router');
const ordersRouter = require('./routes/order/router');
const mediasRouter = require('./routes/media/router');
var queriesRouter = require('./routes/queries/router')
//import contect string database
const { CONNECTION_STRING, DB_NAME } = require('./constants/db');
// import authenticate
const{passportVerifyToken, passportVerifyAccount, passportConfigBasic} = require('./middlewares/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// byPass cors for web browser accept connect react
app.use(
  cors({
    origin: '*',
  }),
)

//connect database
mongoose.connect(`${CONNECTION_STRING}${DB_NAME}`);

//register passport
passport.use(passportVerifyToken);
passport.use(passportVerifyAccount);
passport.use(passportConfigBasic);

app.use('/auth', authRouter);
app.use('/products', passport.authenticate('jwt', { session: false }), productsRouter);
app.use('/categories', passport.authenticate('jwt', { session: false }), categoriesRouter);
// passport.authenticate('local', { session: false }
app.use('/suppliers', passport.authenticate('jwt', { session: false }), suppliersRouter);
app.use('/customers', passport.authenticate('jwt', { session: false }), customersRouter);
app.use('/employees', passport.authenticate('jwt', { session: false }), employeesRouter);
app.use('/orders', passport.authenticate('jwt', { session: false }), ordersRouter);
app.use('/medias', passport.authenticate('jwt', { session: false }), mediasRouter);
app.use('/queries', passport.authenticate('jwt', {session: false}), queriesRouter);

 
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

module.exports = app;
