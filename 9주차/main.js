const express = require('express');
const app = express()
var bodyParser = require('body-parser');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2024'
};
var sessionStore = new MySqlStore(options);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
var db = require('./lib/db')
//var topic = require('./lib/topic');
//var author = require('./lib/author');
var authorRouter = require('./router/authorRouter');
var rootRouter = require('./router/rootRouter');

app.use('/', rootRouter);
app.use('/author', authorRouter);
app.use(express.static('public'));

// //app.get('/', (req, res) => {
// //    topic.home(req, res);
// //})
// //app.get('/page/:pageId', (req, res) => {
// //    topic.page(req, res);
// })
// app.get('/create', (req, res) => {
//     topic.create(req, res);
// })
// app.post('/create_process', (req, res) => {
//     topic.create_process(req, res);
// })
// app.get('/update/:pageId', (req, res) => {
//     topic.update(req, res);
// })
// app.post('/update_process', (req, res) => {
//     topic.update_process(req, res);
// })
// app.get('/delete/:pageId', (req, res) => {
//     topic.delete_process(req, res);
// })
// app.get('/author', (req, res) => {
//     author.create(req, res);
// })
// app.post('/author/create_process', (req, res) => {
//     author.create_process(req, res);
// })
// app.get('/author/update/:pageId', (req, res) => {
//     author.update(req, res);
// })
// app.post('/author/update_process', (req, res) => {
//     author.update_process(req, res);
// })
// app.get('/author/delete/:pageId', (req, res) => {
//     author.delete_process(req, res);
// })
// app.get('/login', (req, res) => {
//     topic.login(req, res);
// })
// app.post('/login_process', (req, res) => {
//     topic.login_process(req, res);
// })
// app.get('/logout_process', (req, res) => {
//     topic.logout_process(req, res);
// })

app.get('/favicon.ico', (req, res) => res.writeHead(404));
app.listen(3000, () => console.log('Example app listening on port 3000'));