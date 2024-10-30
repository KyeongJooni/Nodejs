const db = require('./db');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

module.exports = {
    getAuthors: (req, res) => {
        db.query('SELECT * FROM author', (error, results) => {
            if (error) {
                return res.status(500).send('Database query failed');
            }
            res.render('authors', { authors: results });
        });
    },


    create: (req, res) => {
        db.query('select * from topic', (err, topics) => {
            if (err) { throw err }
            db.query('select * from author', (err2, authors) => {
                if (err2) { throw err2 }
                var i = 0;
                var tag = '<table border="1" style="border-collapse: collapse;">'
                for (i = 0; i < authors.length; i++) {
                    tag += `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td>
                                    <td><a href="/author/update/${authors[i].id}">update</a></td>
                                    <td><a href="/author/delete/${authors[i].id}" onclick=
                                        'if(confirm("정말로 삭제하시겠습니까?")==false){return false}'>delete</a></td></tr>`
                }
                tag += '</table>'

                var b = `<form action='/author/create_process' method='post'>
                                <p><input type='text' name='name' placeholder='name'></p>
                                <p><input type='text' name='profile' placeholder='profile'></p>
                                <p><input type='submit' value='저자생성'></p>
                             </form>`

                var context = {
                    title: 'WEB AUTHOR 테이블',
                    list: topics,
                    menu: tag,
                    body: b
                }
                res.render('home', context, (err, html) => res.end(html))
            })
        })
    },

    create_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var sanitizedName = sanitizeHtml(post.name);
            var sanitizedProfile = sanitizeHtml(post.profile)
            db.query(`insert into author (name, profile) 
                                values(?,?)`,
                [sanitizedName, sanitizedProfile], (error, result) => {
                    if (error) {
                        throw error
                    }
                    res.redirect(`/author`)
                    res.end();
                }); //query 종료
        })
    },

    update: (req, res) => {
        var authorId = req.params.authorId;  // URL에서 authorId 가져오기
        db.query('SELECT * FROM author WHERE id = ?', [authorId], (error, author) => {
            if (error) {
                console.error("DB Query Error: ", error);  // DB 에러
                throw error;
            }

            if (!author || author.length === 0) {
                console.error("No author found with id: ", authorId);  // 저자가 없을 때 로그 출력
                return res.status(404).send("Author not found");
            }

            // 저자 수정 폼 생성
            var b = `<form action="/author/update_process" method="post">
                            <input type="hidden" name="id" value="${author[0].id}">
                            <p><input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="Name"></p>
                            <p><input type="text" name="profile" value="${sanitizeHtml(author[0].profile)}" placeholder="Profile"></p>
                            <p><input type="submit" value="저자 수정"></p>
                        </form>`;

            // menu 변수 추가
            var m = `<a href="/author/create">create</a>&nbsp;&nbsp;
                         <a href="/author/update/${authorId}">update</a>&nbsp;&nbsp;
                         <a href="/author/delete/${authorId}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){return false}'>delete</a>`;

            db.query('SELECT * FROM topic', (err, topics) => {
                if (err) {
                    console.error("DB Query Error: ", err);
                    throw err;
                }

                var context = {
                    title: 'WEB AUTHOR 테이블',
                    body: b,
                    menu: m,    // menu 변수 추가
                    list: topics  // list도 같이 전달
                };
                res.render('home', context, (err, html) => {
                    if (err) {
                        console.error("Render Error: ", err);
                        throw err;
                    }
                    res.end(html);
                });
            });
        });
    },

    // 저자 정보 업데이트
    update_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var sanitizedName = sanitizeHtml(post.name);
            var sanitizedProfile = sanitizeHtml(post.profile);

            db.query('UPDATE author SET name = ?, profile = ? WHERE id = ?',
                [sanitizedName, sanitizedProfile, post.id], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    res.redirect(`/author`);  // 업데이트 후 저자 목록 페이지 리다이렉트
                    res.end();
                });
        });
    },

    // 저자 삭제
    delete: (req, res) => {
        var authorId = req.params.authorId;  // URL에서 authorId 가져오기

        // 저자 삭제 쿼리 실행
        db.query('DELETE FROM author WHERE id = ?', [authorId], (error, result) => {
            if (error) {
                throw error;
            }
            // 삭제 후 저자 목록 페이지 리다이렉트
            res.redirect(`/author`);
            res.end();
        });
    },
};
