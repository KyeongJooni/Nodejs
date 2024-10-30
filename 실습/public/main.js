const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const template = `
    <!doctype html>
    <html>
    <head>
        <title>책과 음악이 있는 곳</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: left;
                margin-top: 50px;
            }
            hr 
            h3 {
                margin: 20px 0;
            }
            ul {
                list-style-type: disc; /* 목록 앞에 점을 붙임 */
                padding-left: 20px; /* 왼쪽으로 이동 */
                text-align: left; /* 목록을 왼쪽으로 정렬 */
                display: none; /* 기본적으로는 숨김 */
            }
            li {
                margin: 10px 0;
                font-size: 18px;
            }
            a {
                text-decoration: none;
                color: blue;
                cursor: pointer;
            }
            a:hover {
                color: red;
            }
        </style>
    </head>
    <body>
        <h1>책과 음악이 있는 곳</h1>
        <hr />
        <h3><a id="bookBtn">1. 책</a></h3>
        <ul id="bookList" style="display:none;">
            <li>총균쇠</li>
            <li>내면소통</li>
        </ul>
        <h3><a id="musikBtn">2. 음악</a></h3>
        <ul id="musikList" style="display:none;">
            <li>클래식 음악</li>
            <li>재즈</li>
        </ul>
        
        <script>
            // 책 버튼 클릭 이벤트
            document.getElementById('bookBtn').addEventListener('click', function() {
                var bookList = document.getElementById('bookList');
                if (bookList.style.display === 'none') {
                    bookList.style.display = 'block';
                } else {
                    bookList.style.display = 'none';
                }
            });

            // 음악 버튼 클릭 이벤트
            document.getElementById('musikBtn').addEventListener('click', function() {
                var musikList = document.getElementById('musikList');
                if (musikList.style.display === 'none') {
                    musikList.style.display = 'block';
                } else {
                    musikList.style.display = 'none';
                }
            });
        </script>
    </body>
    </html>
    `;
    res.send(template);
});

app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000');
});