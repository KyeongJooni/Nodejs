const express = require('express');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var options = {
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2024'
};
var sessionStore = new MySqlStore(options);
const app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));
const rootRouter = require('./router/rootRouter');
const authRouter = require('./router/authRouter');
app.use(express.static('public'));
app.use('/', rootRouter);
app.use('/auth', authRouter);
app.get('/favicon.ico', (req, res) => res.writeHead(404));
app.listen(3000, () => console.log('Example app listening on port 3000'));