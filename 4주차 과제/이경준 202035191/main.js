const express = require('express');
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    var context = {
        title: 'WEB DB 과제4',
        number: '202035191',
        name: '이경준',
        header: 'webdb24에 생성된 테이블 목록'
    };
    res.render('home', context, (err, html) => {
        if (err) throw err;
        res.end(html);
    });
});


app.get('/:id', (req, res) => {
    var id = req.params.id.toUpperCase();  
    var context = { title: id };
    
    if (id === 'AUTHOR') {
        res.render('author', context, (err, html) => {
            if (err) throw err;
            res.end(html);
        });
    } else if (id === 'TOPIC') {
        res.render('topic', context, (err, html) => {
            if (err) throw err;
            res.end(html);
        });
    } else {
        res.status(404).send('페이지를 찾을 수 없습니다.');
    }
});


app.get('/favicon.ico', (req, res) => res.writeHead(404));


app.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000');
});
