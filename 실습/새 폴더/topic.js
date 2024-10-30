var db = require('./db');
var qs = require('querystring');

module.exports = {
    home: (req, res) => {
        db.query('SELECT * FROM topic', (error, topics) => {
            var m = '<a href="/create">create</a>'
            var b = '<h2>Welcome</h2><p>Node.js Start Page</p>'
            var context = {
                list: topics,
                menu: m,
                body: b
            };
            req.app.render('home', context, (err, html) => {
                res.end(html)
            }); //render 메소드 종료
        }); // query 메소드 종료
    },
    //페이지id변수를 불러오는 코드 입력, 시멘틱url을 부르기 위해서?
    page: (req, res) => {
        var id = req.params.pageId;
        db.query('SELECT * FROM topic', (error, topics) => { // topics에 여러개의 레코드가 저장, 리스트 구조로 레코드 하나가 하나의 객체로 이루어짐
            if (error) { //각각의 레코드르 읽어오려면 topics[0]이런식으로 읽어와야 함, db에서 읽어온 자료는 인덱스를 붙여줘야 한다
                throw error;
            }
            //토픽 테이블의 id값과 url에 요청된 아이디 값이 같을 때 
            db.query(`SELECT * FROM topic WHERE id = ${id}`, (error2, topic) => {
                if (error2) {
                    throw error2;
                }
                var m = `<a href="/create">create</a>&nbsp;&nbsp;<a href="/update/${topic[0].id}">update</a>&nbsp;&nbsp;<a href="#">delete</a>` //메뉴
                var b = `<h2>${topic[0].title}</h2><p>${topic[0].descrpt}</p>`//타이틀과 디스크립트
                var context = {
                    list: topics, //리스트
                    menu: m, //메뉴에 넘겨줌
                    body: b // 바디에 넘겨줌
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html)
                })
            }) // 두번째 query 메소드 종료
        }); // 첫번째 query 메소드 종료
    },
    create: (req, res) => {
        db.query('select * from topic', (error, topics) => {
            if (error) {
                throw error
            }
            var b = `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit"></p>
        </form>`
            var context = {
                list: topics,
                menu: '<a href="/create">create</a>',
                body: b
            };
            res.render('home', context, (err, html) => {
                res.end(html)
            }); //render 종료
        }); //첫번째 query 종료
    },
    create_process: (req, res) => {
        var body = '';
        req.on('data', (data) => { //이벤트 이름을 넘겨주고, 콜백함수를 실행, data는 패킷을 수신할 때마다 발생하는 이벤트
            body = body + data; // 바디에다가 data를 연결해준다.
        });
        req.on('end', () => { // 데이터를 다 받았을 시 엔드이벤트 발생
            var post = qs.parse(body); // 바디를 parsing하면 바디를 객체화하여 포스트함
            db.query(` 
        INSERT INTO topic (title, descrpt, created) 
        VALUES(?, ?, NOW())`, //데이터베이스에 insert함
                [post.title, post.description], (error, result) => { // 첫번째 인자, 두번째 인자, 세번째 파라미터는 콜백함수
                    if (error) {
                        throw error; //오류 발생 시 오류 출력
                    }
                    res.writeHead(302, { Location: `/page/${result.insertId}` });
                    res.end();
                }
            );
        });
    },
    update: (req, res) => {
        var id = req.params.pageId;
        db.query('select * from topic', (error, topics) => {
            if (error) {
                throw error
            }
            db.query(`select * from topic where id = ${id}`, (error2, topic) => {
                if (error2) {
                    throw error2
                }
                var m = `<a href="/create">create</a>&nbsp;&nbsp;
        <a href="/update/${topic[0].id}">update</a>&nbsp;&nbsp;<a href="#">delete</a>`
                var b = `<form action="/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
        <p><textarea name="description" placeholder="description">${topic[0].descrpt}</textarea></p>
        <p><input type="submit"></p>
        </form>`
                var context = {
                    list: topics,
                    menu: m,
                    body: b
                };
                res.render('home', context, (err, html) => {
                    res.end(html)
                }); //render 종료
            }); //두번째 query 종료
        }); //첫번째 query 종료
    },
    update_process: (req, res) => { //클라이언트가 보내준 정보를 잘 받아서 파싱하고 클라이언트가 보내준 아이디가 같은 글에서 업데이트?
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            db.query(`update topic set title = ?, descrpt = ? where id = ?`,
                [post.title, post.description, post.id], (error, result) => {//1,2,3번째 파라미터, 콜백함수
                    if (error) {
                        throw error
                    }
                    res.writeHead(302, { Location: `/page/${post.id}` }); // redirection
                    res.end();
                }); //첫번째 query 종료
        })
    },

}