const express = require('express'); // 익스프레스(Express) 모듈을 요청하여 사용할 수 있도록 불러옴
const app = express(); // 익스프레스 애플리케이션 객체 생성

// 뷰 템플릿이 저장된 디렉토리를 설정 (현재 디렉토리의 'views' 폴더)
app.set('views', __dirname + '/views');

// 뷰 엔진으로 EJS를 사용하도록 설정 (EJS는 템플릿 엔진 중 하나로, HTML 파일을 동적으로 렌더링할 수 있음)
app.set('view engine', 'ejs');

console.log(app); // 생성된 애플리케이션 객체의 상태를 콘솔에 출력

// MySQL 모듈을 요청하여 사용 가능하게 함
var mysql = require('mysql');

// MySQL 데이터베이스와의 연결 설정 (호스트, 사용자, 비밀번호, 데이터베이스 이름 지정)
var connection = mysql.createConnection({
    host: 'localhost', // 데이터베이스 서버의 호스트명 (로컬호스트)
    user: 'nodejs', // MySQL 사용자 이름
    password: 'nodejs', // MySQL 비밀번호
    database: 'webdb2024' // 연결할 데이터베이스 이름
});

// MySQL 데이터베이스에 연결을 시도
connection.connect();

// 루트 경로('/')에 대한 GET 요청을 처리하는 라우트
app.get('/', (req, res) => {
    var context = { title: 'Welcome-1' }; // 템플릿에 전달할 데이터 객체 (title 값을 'Welcome-1'로 설정)

    // 'home' 템플릿을 렌더링하고, context 데이터를 전달
    res.render('home', context, (err, html) => {
        // 렌더링된 HTML을 응답으로 클라이언트에 전송
        res.end(html);
    });
});

// 동적 경로('/:id')에 대한 GET 요청을 처리하는 라우트
app.get('/:id', (req, res) => {
    var id = req.params.id; // URL 경로에서 동적으로 전달된 'id' 값을 추출

    var context = { title: id }; // 추출한 id 값을 title로 설정하여 템플릿에 전달할 데이터 객체 생성

    // 'home' 템플릿을 렌더링하고, context 데이터를 전달
    res.render('home', context, (err, html) => {
        // 렌더링된 HTML을 응답으로 클라이언트에 전송
        res.end(html);
    });
});

// 다시 루트 경로('/')에 대한 GET 요청을 처리하는 라우트 (MySQL 쿼리를 포함)
app.get('/', (req, res) => {
    // MySQL 쿼리 실행 (SELECT * FROM topic)하여 topic 테이블의 모든 데이터를 조회
    connection.query('SELECT * FROM topic', (error, results) => {
        // 쿼리 결과에서 첫 번째 레코드 데이터를 context 객체에 넣음
        var context = {
            list: results[0], // 조회된 결과에서 첫 번째 행을 'list'에 저장
            title: 'Welcome' // title은 'Welcome'으로 설정
        };

        console.log(context); // context 객체를 콘솔에 출력하여 확인

        // 'home' 템플릿을 렌더링하고, context 데이터를 전달
        res.render('home', context, (err, html) => {
            // 렌더링된 HTML을 응답으로 클라이언트에 전송
            res.end(html);
        });
    });

    // MySQL 연결을 종료 (이 부분은 필요하지 않음, 따라서 제거하는 것이 좋음. 한번 연결 후 유지하는 것이 일반적)
    connection.end();
});

// favicon.ico 요청이 있을 때 404 상태 코드를 응답으로 전송
app.get('/favicon.ico', (req, res) => res.writeHead(404));

// 서버를 3000번 포트에서 실행하며, 성공적으로 실행되면 콘솔에 메시지 출력
app.listen(3000, () => console.log('Example app listening on port 3000'));