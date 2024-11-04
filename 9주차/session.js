var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2024'
};
var sessionStore = new MySqlStore(options);
var app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.use(function (req, res, next) {
    if (!req.session.views) {
        req.session.views = {};
    }
    //get the url pathname
    var pathname = parseurl(req).pathname;
    //count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    next();
});

app.use('/user/:id', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
})
app.get('/user/:id', function (req, res, next) {
    console.log('ID:', req.params.id);
    next();
}, function (req, res, next) {
    res.send('User Info');
})
app.get('/user/:id', function (req, res, next) {
    res.end(req.params.id);
})

app.get('/foo', function (req, res, next) {
    console.log(req, session);
    res.send('you viewed this page' + req.session.views['/foo'] + ' times');
});
app.get('/bar', function (req, res, next) {
    res.send('you viewed this page' + req.session.views['/bar'] + ' times');
});
app.listen(3000, function () {
    console.log('3000!');
});