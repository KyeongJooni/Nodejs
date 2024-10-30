//05.js
var db = require('./db');
var qs = require('querystring');

module.exports = {
    home: (req, res) => {
        db.query('SELECT * FROM schedule05', (error, schedules) => {
            if (error) {
                throw error;
            }
            var m = '<a href="/create">일정생성</a>';
            var detail;

            if (schedules.length === 0) {
                detail = '<h2 class="schedule-title">상세 일정</h2><p class="no-data">자료가 없으니 일정 생성 링크를 이용하여 자료를 입력하세요.</p>';
            } else {
                detail = '<h2 class="schedule-title">상세 일정</h2>';
                detail += '<p class="no-data">제목을 클릭하시면 여기에 상세 일정 내용이 나옵니다.</p>';
            }

            var context = {
                schedules: schedules,
                menu: m,
                detail: detail
            };
            res.render('05', context, (err, html) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Render error');
                    return;
                }
                res.end(html);
            });
        });
    },

    page: (req, res) => {
        var id = req.params.pageId;
        db.query('SELECT * FROM schedule05', (error, schedules) => {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM schedule05 WHERE id = ${id}`, (error2, schedule) => {
                if (error2) {
                    throw error2;
                }
                var m = `<a href="/create">일정생성</a>&nbsp;&nbsp;<a href="/update/${schedule[0].id}">일정수정</a>&nbsp;&nbsp;<a href="#">일정삭제</a>`;
                var detail = `
                        <h3>${schedule[0].title}</h3>
                        <p-class="no-data">일정 시작일: ${schedule[0].start}</p>
                        <p-class="no-data">일정 종료일: ${schedule[0].end}</p>
                        <p-class="no-data">상세 일정: ${schedule[0].content}</p>
                    `;

                var context = {
                    schedules: schedules,
                    menu: m,
                    detail: detail
                };
                res.render('05', context, (err, html) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Render error');
                        return;
                    }
                    res.end(html);
                });
            });
        });
    },

    create: (req, res) => {
        db.query('SELECT * FROM schedule05', (error, schedules) => {
            if (error) {
                throw error;
            }
            var m = '<a href="/create">일정생성</a>';
            var detail = `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="일정 제목" required></p>
                <p><input type="text" name="start" placeholder="시작 날짜 (YYYYMMDD)" required></p>
                <p><input type="text" name="end" placeholder="종료 날짜 (YYYYMMDD)" required></p>
                <p><textarea name="content" placeholder="내용" required></textarea></p>
                <p><input type="submit" value="제출"></p>
                </form>`;

            var context = {
                schedules: schedules,
                menu: m,
                detail: detail
            };

            res.render('05', context, (err, html) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Render error');
                    return;
                }
                res.end(html);
            });
        });
    },
    create_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            db.query(` 
                    INSERT INTO schedule05 (title, start, end, content, created) 
                    VALUES(?, ?, ?, ?, NOW())`,
                [post.title, post.start, post.end, post.content],
                (error, result) => {
                    if (error) {
                        throw error;
                    }
                    res.writeHead(302, { Location: `/page/${result.insertId}` });
                    res.end();
                }
            );
        });
    },

    update: (req, res) => {
        var id = req.params.pageId;
        db.query('SELECT * FROM schedule05', (error, schedules) => {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM schedule05 WHERE id = ${id}`, (error2, schedule) => {
                if (error2) {
                    throw error2;
                }
                var m = `<a href="/create">일정 생성</a>&nbsp;&nbsp;<a href="/update/${schedule[0].id}">일정 수정</a>&nbsp;&nbsp;<a href="#">일정 삭제</a>`;
                var form = `
                        <form action="/update_process" method="post">
                            <input type="hidden" name="id" value="${schedule[0].id}">
                            <p><input type="text" name="title" placeholder="일정 제목" value="${schedule[0].title}" required></p>
                            <p><input type="text" name="start" placeholder="시작 날짜 (YYYYMMDD)" value="${schedule[0].start}" required></p>
                            <p><input type="text" name="end" placeholder="종료 날짜 (YYYYMMDD)" value="${schedule[0].end}" required></p>
                            <p><textarea name="content" placeholder="내용" required>${schedule[0].content}</textarea></p>
                            <p><input type="submit" value="제출"></p>
                        </form>
                    `;
                var context = {
                    schedules: schedules,
                    menu: m,
                    detail: form // 수정된 폼을 detail에 할당
                };
                res.render('05', context, (err, html) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Render error');
                        return;
                    }
                    res.end(html);
                });
            });
        });
    },

    update_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            db.query(`UPDATE schedule05 SET title = ?, start = ?, end = ?, content = ? WHERE id = ?`,
                [post.title, post.start, post.end, post.content, post.id], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    res.writeHead(302, { Location: `/page/${post.id}` });
                    res.end();
                });
        });
    },
};