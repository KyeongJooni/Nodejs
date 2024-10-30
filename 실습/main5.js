const express = require('express');
const app = express()

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log(app);

//var db = require('/lib/db');
const topic = require('./lib/topic');

app.get('/', (req, res) => {
    topic.home(req, res);
})

app.get('/page/:pageId', (req, res) => {
    //프로그램 작성
    topic.page(req, res)
})

app.get('/create', (req, res) => {
    topic.create(req, res)
})

app.post('/create_process', (req, res) => {
    topic.create_process(req, res)
})

app.get('/update/:pageId', (req, res) => {
    topic.update(req, res);
})

app.post('/update_process', (req, res) => {
    topic.update_process(req, res);
})

app.get('/favicon.ico', (req, res) => res.writeHead(404));
app.listen(3000, () => console.log('Example app listening on port 3000'));
// app.get('/', (req, res) => {
//     db.query('SELECT * FROM topic', (error, results) => {  //connection이었던 변수를 db로 수정
//         /* 여기서부터 추가된 내용 */
//         var lists = '<ol type="1">';
//         var i = 0;
//         while (i < results.length) {
//             lists = lists + `<li><a href="#">${results[i].title}</a></li>`;
//             i = i + 1;
//         }
//         lists = lists + '</ol> ';
//         /* 추가된 내용 끝 */
//         var context = {
//             list: lists, // results가 아니라 lists를 넘겨줌
//             title: 'Welcome-db 모듈 생성'
//         };
//         console.log(context)
//         res.render('home', context, (err, html) => {
//             res.end(html)
//         })
//     });
//     db.end();

// })