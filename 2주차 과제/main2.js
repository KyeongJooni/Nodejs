const express = require('express');
const app = express();

// 홈 페이지
app.get('/', (req, res) => {
    const title = '책과 음악이 있는 곳';
    const template = `
<!doctype html>
<html>
<head>
<title>${title}</title> 
<meta charset="utf-8">
<style>
    ul.no-bullets {
        list-style-type: none; /* 점 제거 */
        padding: 0; /* 패딩 제거 */
        margin: 0; /* 여백 제거 */
    }
    ul.with-bullets {
        list-style-type: disc; /* 점 추가 */
        padding-left: 20px; /* 왼쪽 패딩 추가 */
    }
</style>
</head>
<body>
<h1>${title}</h1> 
<hr>
    <ul class="no-bullets">
        <li><a href="/BOOK" title="//127.0.0.1:3000/BOOK">1. 책</a></li> 
        <li><a href="/MUSIC" title="//127.0.0.1:3000/MUSIC">2. 음악</a></li>
    </ul>
</body>
</html>`;
    res.send(template);
});

// 책 페이지
app.get('/BOOK', (req, res) => {
    const title = '책과 음악이 있는 곳';
    const template = `
<!doctype html>
<html>
<head>
<title>${title}</title> 
<meta charset="utf-8">
<style>
    ul.no-bullets {
        list-style-type: none; /* 점 제거 */
        padding: 0; /* 패딩 제거 */
        margin: 0; /* 여백 제거 */
    }
    ul.with-bullets {
        list-style-type: disc; /* 점 추가 */
        padding-left: 20px; /* 왼쪽 패딩 추가 */
    }
</style>
</head>
<body>
<h1>${title}</h1> 
<hr>
    <ul class="no-bullets">
        <li><a href="/BOOK" title="//127.0.0.1:3000/BOOK">1. 책</a></li>
    </ul>
    <ul class="with-bullets">
        <li>총균쇠</li>
        <li>내면소통</li>
    </ul>
    <ul class="no-bullets">
        <li><a href="/Music" title="//127.0.0.1:3000/MUSIC">2. 음악</a></li>
    </ul>
</body>
</html>`;
    res.send(template);
});

// 음악 페이지
app.get('/MUSIC', (req, res) => {
    const title = '책과 음악이 있는 곳';
    const template = `
<!doctype html>
<html>
<head>
<title>${title}</title> 
<meta charset="utf-8">
<style>
    ul.no-bullets {
        list-style-type: none; /* 점 제거 */
        padding: 0; /* 패딩 제거 */
        margin: 0; /* 여백 제거 */
    }
    ul.with-bullets {
        list-style-type: disc; /* 점 추가 */
        padding-left: 20px; /* 왼쪽 패딩 추가 */
    }
</style>
</head>
<body>
<h1>${title}</h1> 
<hr>
    <ul class="no-bullets">
        <li><a href="/BOOK" title="127.0.0.1:3000/BOOK">1. 책</a></li> 
        <li><a href="/MUSIC" title="127.0.0.1:3000/MUSIC">2. 음악</a></li>
    </ul>
    <ul class="with-bullets">
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
app.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000');
});