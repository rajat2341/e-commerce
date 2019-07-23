var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./config/login_passport');
var flash = require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');
var profile = require('./routes/profile');
const auth = require('./routes/auth');
var admin = require('./routes/admin');
var dp = require('./routes/dp');
var cart = require('./routes/cart');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use('/', indexRouter);
app.use('/', usersRouter);

// app.use('/',function (req,res) {
//     res.send("*");
// })

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use('/',login);
app.use('/',auth);
app.use('/',register);
app.use('/',profile);
app.use('/',logout);
app.use('/admin',(req,res,next)=>{
  if(req.user){
    if(req.user.role=='user'){
      res.redirect('/logout');
    }
  }
  next();
},admin);
app.use('/',dp);
app.use('/',cart);


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
