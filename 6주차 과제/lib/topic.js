const db = require('./db');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

module.exports = {

    home: (req, res) => {
        db.query('SELECT * FROM topic', (error, topics) => {
            var m = '<a href="/create">create</a>'
            var b = '<h2>Welcome</h2><p>Node.js Start Page</p>'

            var context = {
                title: 'WEB TOPIC 테이블',
                list: topics,
                menu: m,
                body: b
            };
            req.app.render('home', context, (err, html) => {
                res.end(html)
            }); //render 메소드 종료
        });  //query 매소드 종료
    },

    page: (req, res) => {
        var id = req.params.pageId;
        db.query('SELECT * FROM topic', (error, topics) => {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ${id}`, (error2, topic) => {
                if (error2) {
                    throw error2;
                }

                var m = `<a href="/create">create</a>&nbsp;&nbsp;
            <a href="/update/${id}">update</a>&nbsp;&nbsp;
            <a href="/delete/${id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>
                delete</a>`
                var b = `<h2>${topic[0].title}</h2>
                     <p>${topic[0].descrpt}</p>
                     <p>by ${topic[0].name}</p>`
                var context = {
                    title: 'WEB TOPIC 테이블',
                    list: topics,
                    menu: m,
                    body: b
                };
                res.app.render('home', context, (err, html) => {
                    res.end(html)
                })
            })
        });
    },

    create: (req, res) => {
        db.query('select * from topic', (error, topics) => {
            if (error) {
                throw error
            }

            db.query(`SELECT * FROM author`, (err, authors) => {
                var i = 0;
                var tag = '';
                while (i < authors.length) {
                    tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
                    i++;
                }
                var context = {
                    title: 'WEB TOPIC 테이블',
                    list: topics,
                    menu: '<a href="/create">create</a>',
                    body: `<form action="/create_process" method="post">
                            <p><input type="text" name="title" placeholder="title"></p>
                            <p><textarea name="description" placeholder="description"></textarea></p>
                            <p><select name ="author">
                                ${tag}
                                </select></p>
                            <p><input type='submit' value='제출'></p>`
                };
                res.app.render('home', context, (err, html) => {
                    res.end(html)
                }); //render 종료
            });;
        }); //첫번쨰 query 종료
    },

    create_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var sanitizedTitle = sanitizeHtml(post.title)
            var sanitizedDescription = sanitizeHtml(post.description)
            var sanitizedAuthor = sanitizeHtml(post.author)
            db.query(`
                INSERT INTO topic (title, descrpt, created, author_id)
                    VALUES(?, ?, NOW(), ?)`,
                [sanitizedTitle, sanitizedDescription, sanitizedAuthor], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    res.redirect(`/page/${result.insertId}`)
                    res.end();
                }); //query 종료
        });
    },

    update: (req, res) => {
        var id = req.params.pageId;
        db.query('select * from topic', (error, topics) => {
            if (error) { throw error }
            db.query(`select * from topic where id = ${id}`, (error2, topic) => {
                if (error2) { throw error2 }
                db.query(`SELECT * FROM author`, (error3, authors) => {
                    if (error3) { throw error3 }
                    var i = 0;
                    var tag = '';
                    while (i < authors.length) {
                        var selected = '';
                        if (authors[i].id === topic[0].author_id) { selected = 'selected'; }
                        tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
                        i++;
                    }

                    var m = `<a href="/create">create</a>&nbsp;&nbsp;<a href="/update/${topic[0].id}">update</a>`
                    var b = `<form action="/update_process" method="post">
                                <input type="hidden" name="id" value="${id}">
                            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                            <p><textarea name="description" placeholder="description">${topic[0].descrpt}</textarea></p>
                            <p><select name="author">
                                ${tag}
                                </select></p>
                            <p><input type="submit"></p>
                            </form>`
                    var context = {
                        title: 'WEB TOPIC 테이블',
                        list: topics,
                        menu: m,
                        body: b
                    };
                    res.render('home', context, (err, html) => {
                        res.end(html)
                    }); //render 종료
                }) //query 종료
            }); // query 종료
        }); // query 종료
    },

    update_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var sanitizedTitle = sanitizeHtml(post.title);
            var sanitizedDescription = sanitizeHtml(post.description)
            var sanitizedAuthor = sanitizeHtml(post.author)
            db.query(`update topic set title = ?, descrpt = ?, author_id = ? where id = ?`,
                [sanitizedTitle, sanitizedDescription, sanitizedAuthor, post.id], (error, result) => {
                    if (error) { throw error }
                    res.writeHead(302, { Location: `/page/${post.id}` }); // redirection
                    res.end();
                }); // query 종료
        })
    },

    delete: (req, res) => {
        var id = req.params.pageId;  // URL에서 pageId 가져오기
        db.query('DELETE FROM topic WHERE id = ?', [id], (error, result) => {
            if (error) {
                throw error;
            }
            res.redirect('/');
        });
    },
}