var db = require('./db')
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');

function authIsOwner(req, res) {
    if (req.session.is_logined) { return true; }
    else {
        return false
    }
}
function authStatusUI(req, res) {
    var login = '<a href="/login">login</a>';
    if (authIsOwner(req, res)) {
        login = '<a href="/logout_process">logout</a>'
    }
    return login;
}
module.exports = {
    home: (req, res) => {
        db.query('SELECT * FROM topic', (error, topics) => {
            var login = authStatusUI(req, res);
            var isOwner = authIsOwner(req, res);
            if (isOwner) {
                login = `<a href="/logout_process">logout</a>`
            }
            else {
                login = `<a href="/login">login</a>`
            }
            console.log(login);
            var m = '<a href="/create">create</a>'
            var b = '<h2> Welcome </h2><p>Node.js Start Page </p>'

            if (topics.length == 0) {
                b = '<h2>Welcome </h2> <p>자료가 없으니 create 링크를 이용하여 자료를 입력하세요</p>'
            }

            var context = {
                title: 'TOPIC 홈 화면',
                list: topics,
                menu: m,
                body: b,
                login: login
            };
            res.render('home', context, (err, html) => {
                res.end(html);
            })
        });
    },
    page: (req, res) => {
        var id = req.params.pageId;
        var login = authStatusUI(req, res);
        db.query('SELECT * FROM topic', (error, topics) => {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM topic  LEFT JOIN author ON topic.author_id = author.id
                 WHERE topic.id = ${id}`, (error2, topic) => {
                if (error2) {
                    throw error2;
                }
                var m = `<a href="/create">create</a>&nbsp;&nbsp;
                        <a href="/update/${id}">update</a>&nbsp;&nbsp;
                        <a href="/delete/${id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false)
                        { return false }'>delete</a>`
                var b = `<h2>${topic[0].title}</h2>
                        <p>${topic[0].descrpt}</p> 
                        <p>by ${topic[0].name}</p>`
                var context = {
                    title: 'TOPIC 상세 화면',
                    list: topics,
                    menu: m,
                    body: b,
                    login: login
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html)
                })
            })
        });
    },

    create: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>
                    alert("Login required ~~~")
                    setTimeout("location.href='http://localhost:3000/'",1000);
                    </script>`)
        }
        db.query('SELECT * FROM topic', (error, topics) => {
            if (error) {
                throw error
            }
            db.query(`SELECT * FROM author`, (err, authors) => {
                var i = 0;
                var tag = '';
                var login = authStatusUI(req, res);
                while (i < authors.length) {
                    tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
                    i++;
                }
                var context = {
                    title: 'TOPIC 자료 생성',
                    login: login,
                    list: topics,
                    menu: '<a href="/create">create</a>',
                    body: `<form action="/create_process" method="post">
                                      <p><input type="text" name="title" placeholder="title"></p>
                                      <p><textarea name="description" placeholder="description">
                                      </textarea></p>
                                      <p><select name="author">
                                        ${tag}
                                        </select></p>
                                      <p><input type="submit"></p>
                                      </form>`};
                res.render('home', context, (err, html) => {
                    res.end(html);
                });
            });
        });
    },
    create_process: (req, res) => {
        // var body = '';
        //req.on('data', (data) => {
        //  body = body + data;
        //});
        //req.on('end', () => {
        //  var post = qs.parse(body);
        var poser = req.body;
        var sanitizedTitile = sanitizeHtml(post.title)
        var sanitizedDescription = sanitizeHtml(post.description)
        var sanitizedAuthor = sanitizeHtml(post.author)
        db.query(`
                INSERT INTO topic (title, descrpt, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [sanitizedTitile, sanitizedDescription, sanitizedAuthor], (error, result) => {
                if (error) {
                    throw error;
                }

                res.redirect(`/page/${result.insertId}`)
                res.end();
            }
        );
    },

    update: (req, res) => {
        var id = req.params.pageId;
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("Login required ~~~")
                setTimeout("location.href='http://localhost:3000/'",1000);
                </script>`)
        }
        db.query('SELECT * FROM topic', (error, topics) => {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM topic WHERE id = ?`, [id], (error2, topic) => {
                if (error2) {
                    throw error2;
                }
                db.query(`SELECT * FROM author`, (error3, authors) => {
                    if (error3) {
                        throw error3;
                    }
                    var login = authStatusUI(req, res);
                    var i = 0;
                    var tag = '';
                    while (i < authors.length) {
                        var selected = '';
                        if (authors[i].id === topic[0].author_id) { selected = 'selected'; }
                        tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
                        i++;
                    }
                    var m = `<a href="/create">create</a>&nbsp;&nbsp;
                            <a href="/update/${topic[0].id}">update</a>`
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
                        title: 'TOPIC 자료 수정',
                        list: topics,
                        menu: m,
                        body: b,
                        login: login
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html)
                    });
                });
            });
        });
    },
    update_process: (req, res) => {
        //var body = '';
        //req.on('data', (data) => {
        //   body = body + data;
        //});
        //req.on('end', () => {
        //  var post = qs.parse(body);
        var post = req.body;
        var sanitizedTitile = sanitizeHtml(post.title)
        var sanitizedDescription = sanitizeHtml(post.description)
        var sanitizedAuthor = sanitizeHtml(post.author)
        db.query(`update topic set title = ?, descrpt = ?, author_id = ? where id =?`,
            [sanitizedTitile, sanitizedDescription, sanitizedAuthor, post.id], (error, result) => {
                if (error) {
                    throw error;
                }
                // res.writeHead(302, {location: `/page/${post.id}`});
                res.redirect(`/page/${post.id}`)
                res.end();
            }
        );
    },
    delete_process: (req, res) => {
        var id = req.params.pageId;
        var login = authStatusUI(req, res);
        if (authIsOwner(req, res) === false) {
            return res.end(`<script type='text/javascript'>alert("Login required ~~~")
                setTimeout("location.href='http://localhost:3000/'",1000);
                </script>`)
        }
        db.query('DELETE FROM topic WHERE id = ?', [id], (error, result) => {
            if (error) {
                throw error;
            }
            // res.writeHead(302, {Location:`/`});
            res.redirect(`/`)
            res.end();
        });
    },
    login: (req, res) => {
        db.query('SELECT * FROM topic', (error, topics) => {
            var m = '<a href="/create">create</a>'
            var b = `<form action="/login_process" method="post">
        <p><input type = "text" name="email" placeholder="email"</p>
        <p><input type = "text" name="password" placeholder="password"</p>
        <p><input type="submit"></p>
        </form>`
            var context = {
                login: `<a href="/login">login</a>`,
                title: 'Login ID/PW 생성',
                list: topics,
                menu: m,
                body: b
            };
            req.app.render('home', context, (err, html) => {
                res.end(html)
            })
        });
    },
    login_process: (req, res) => {
        //var body = '';
        //req.on('data', (data) => {
        //    body = body + data;
        //});
        //req.on('end', () => {
        //   var post = qs.parse(body);
        var post = req.body;
        if (post.email === 'bhwang99@gachon.ac.kr' && post.password === '123456') {
            req.session.is_logined = true;
            res.redirect('/');
        }
        else {
            res.end('who?');
        }
    },
    logout_process: (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/');
        })
    }
}