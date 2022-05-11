var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods')
var carousels = require('./routes/carousels');
var root = require('./routes/root');

var app = express();

// 使用跨域处理中间件
app.use(require('cors')())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

//托管静态文件，使其能够被访问
app.use('/static', express.static(path.resolve('server/static')))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//实例化数据库连接
require('./plugins/db')(app)

app.use(function (req,res,next) {
  if(req.cookies.userId){
    next();
  }else{
      console.log("url:"+req.originalUrl);
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/')>-1){
          next();
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
          });
      }
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/home', carousels);
app.use('/goods', goods);
app.use('/root', root);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
