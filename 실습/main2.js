const express = require('express');
const app = express();

// 홈 페이지
app.get('/', (req, res) => {
    var title = '책과 음악이 있는 곳';

    var template = `
<!doctype html>
<html>
<head>
<title>${title}</title> 
<meta charset="utf-8">
</head>
<body>
<h1>${title}</h1> 
<hr>
    <li><a href="/Books">1. 책</a></li> 
    <br>
    <li><a href="/Music">2. 음악</a></li>
</body>
</html>`;
    res.send(template);
});

// 책 페이지
app.get('/Books', (req, res) => {
    var title = '책과 음악이 있는 곳';
    var template = `
<!doctype html>
<html>
<head>
<title>${title}</title> 
<meta charset="utf-8">
<style
</head>
<body>
<h1>${title}</h1> 
<hr>
    <li><a href="/Books">1. 책</a></li> 
    <ul>
    <li>총균쇠</li>
    <li>내면소통</li>
    </ul>
    <li><a href="/Music">2. 음악</a></li>
</body>
</html>`;
    res.send(template);
});

// 음악 페이지
app.get('/Music', (req, res) => {
    var title = '책과 음악이 있는 곳';

    var template = `
<!doctype html>
<html>
<head>
<title>${title}</title> 
<meta charset="utf-8">
</head>
<body>
<h1>${title}</h1> 
<hr>
    <li><a href="/Books">1. 책</a></li> 
    <li><a href="/Music">2. 음악</a></li>
    <ul>
    <li>클래식</li>
    <li>재즈</li>
    </ul>
</body>
</html>`;
    res.send(template);
});

// favicon 요청 404 처리
app.get('/favicon.ico', (req, res) => res.status(404).send());

// 서버 실행
app.listen(3000, () => console.log('Example app listening on port 3000'));