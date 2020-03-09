var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var validate = require("./middleware/validate");
var messages = require("./middleware/messages");
var user =require("./middleware/user");
var entries = require("./routes/entries");
var register = require("./routes/register");
var login = require("./routes/login");
var api = require("./routes/api");
var Entry = require('./models/entry');
var session = require("express-session");

var app = express();

// view engine setup 设置默认的模板引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);
// 放在资源文件的后面 不然会浪费时间去数据库取数据
app.use(express.static(path.join(__dirname, "public")));
app.use(messages);
app.use('/api',api.auth);
app.use(user);

app.get('/api/user/:id',api.user);
app.post('/api/entry',entries.submit);
app.get('/api/entries/:page?', page(Entry.count), api.entries);

// app.get("/post", entries.form);
app.post(
  "/post",
  validate.required("entry[title]"),
  validate.lengthAbove("entry[title]", 4),
  entries.submit
);

app.get("/", entries.list);

app.get("/register", register.form);
app.post("/register", register.submit);

app.get("/login", login.form);
app.post("/login", login.submit);
app.get("/logout", login.logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
