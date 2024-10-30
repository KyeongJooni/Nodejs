const express = require('express'); // 익스프레스(Express) 모듈을 요청하여 사용할 수 있도록 불러옴
const app = express(); // 익스프레스 애플리케이션 객체 생성

// 뷰 템플릿이 저장된 디렉토리를 설정 (현재 디렉토리의 'views' 폴더)
app.set('views', __dirname + '/views');

// 뷰 엔진으로 EJS를 사용하도록 설정 (EJS는 템플릿 엔진 중 하나로, HTML 파일을 동적으로 렌더링할 수 있음)
app.set('view engine', 'ejs');

// 루트 경로('/')에 대한 GET 요청을 처리하는 라우트
app.get('/', (req, res) => {
    // 템플릿에 전달할 데이터 객체 (title을 'Welcome-1'로 설정)
    var context = { title: 'Welcome-1' };

    // 'home' 템플릿을 렌더링하고, 템플릿에 context 데이터를 전달
    res.render('home', context, (err, html) => {
        // 렌더링된 HTML을 응답으로 클라이언트에 전송
        res.end(html);
    });
});

// 동적 경로('/:id')에 대한 GET 요청을 처리하는 라우트
app.get('/:id', (req, res) => {
    // URL 경로에서 동적으로 전달된 'id' 값을 추출
    var id = req.params.id;

    // 추출한 id 값을 title로 설정하여 템플릿에 전달할 데이터 객체 생성
    var context = { title: id };

    // 'home' 템플릿을 렌더링하고, context 데이터를 전달 (title에 동적으로 id 값이 들어감)
    res.render('home', context, (err, html) => {
        // 렌더링된 HTML을 응답으로 클라이언트에 전송
        res.end(html);
    });
});

// favicon.ico 요청이 있을 때 404 상태 코드를 응답으로 전송
app.get('/favicon.ico', (req, res) => res.writeHead(404));

// 서버를 3000번 포트에서 실행하며, 성공적으로 실행되면 콘솔에 메시지 출력
app.listen(3000, () => console.log('Example app listening on port 3000'));