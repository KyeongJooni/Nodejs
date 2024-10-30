var db = require('./db')
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');

function authIsOwner(req, res) {
    var isOwner = false;
    var cookies = {};
    if(req.headers.cookie) {
        cookies = cookie.parse(req.headers.cookie);  }
    if(cookies.email==='rudwns0224@gachon.ac.kr' && cookies.password==='123456') {
        isOwner = true; }
    return isOwner
}
function authStatusUI(req, res) {
    var login = '<a href="/login">login</a>';
    if(authIsOwner(req, res)) {
        login = '<a href="/logout_process">logout</a>' }
    return login;
}

module.exports = {
    create : (req, res) => {
        db.query('SELECT * FROM topic', (err, topics) => {
            if(err) {
                throw err
            } 
            db.query(`SELECT * FROM author`, (err2, authors) => {
                if(err2) {
                    throw err2
                } 
                var login = authStatusUI(req, res);
                var i = 0;
                var tag = '<table border="1" style="border-collapse: collapse;">'
                for ( i=0; i<authors.length; i++) {
                    tag += `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td>
                            <td><a href="/author/update/${authors[i].id}">update</a></td>
                            <td><a href="/author/delete/${authors[i].id}" 
                            onclick='if(confirm("정말로 삭제하시겠습니까?")==false)
                            {return false}'>delete</a></td></tr>`
                }
                tag += '</table>'
                var button = '';
                if(authIsOwner(req, res) === true){
                    button = `<form action="/author/create_process" method="post">
                                    <p><input type="text" name="name" placeholder="name"></p>
                                    <p><input type="text" name="profile" placeholder="profile"></p>
                                    <p><input type="submit" value="저자생성"</p>
                                    </form>` ;
                }
                var context = {title: 'AUTHOR 자료 생성',
                            list : topics,
                            menu : tag,
                            body : button,
                            login : login }
                res.render('home', context, (err,html)=>{
                res.end(html);
                });
            });
        });
    },
    create_process : (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var sanitizedName = sanitizeHtml(post.name)
            var sanitizedProfile = sanitizeHtml(post.profile)
            db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
                [sanitizedName, sanitizedProfile], (error, result) => {
                    if(error) {
                        throw error;
                    }
                    res.redirect(`/author`)
                    res.end();
            });
        });
    },
    update : (req, res) => {
        var id = req.params.pageId;
        if(authIsOwner(req, res) === false){
            return res.end(`<script type='text/javascript'>
                    alert("Login required ~~~")
                    setTimeout("location.href='http://localhost:3000/'",1000);
                    </script>`)
        }
        db.query('SELECT * FROM topic', (error,topics)=>{ 
            if(error){
                throw error;}
            db.query(`SELECT * FROM author WHERE id = ?`, [id],(error2, authors)=>{
                if(error2){
                    throw error2;}
                db.query(`SELECT * FROM author`, (error3, allAuthors) => {
                    if(error3){
                        throw error3;}
                    var login = authStatusUI(req, res);
                    var i = 0;
                    var tag = '<table border="1" style="border-collapse: collapse;">'
                    for ( i=0; i<allAuthors.length; i++) {
                        tag += `<tr><td>${allAuthors[i].name}</td><td>${allAuthors[i].profile}</td>
                                <td><a href="/author/update/${allAuthors[i].id}">update</a></td>
                                <td><a href="/author/delete/${allAuthors[i].id}" 
                                onclick='if(confirm("정말로 삭제하시겠습니까?")==false)
                                {return false}'>delete</a></td></tr>`
                    }                            
                    tag += '</table>'
                    var b = `<form action="/author/update_process" method="post">
                                        <input type="hidden" name="id" value="${id}">
                                        <p><input type="text" name="name" placeholder="name" 
                                        value="${authors[0].name}"></p>
                                        <p><input type="text" name="profile" placeholder="profile"
                                        value="${authors[0].profile}"></p>
                                        <p><input type="submit" value="수정"</p>
                                        </form>` 
                    var context = {title: 'AUTHOR 자료 수정',
                                list : topics,
                                menu : tag,
                                body : b,
                                login : login}
                    res.render('home', context, (err,html)=>{
                    res.end(html);
                    });
                });
            });
        });
    },
    update_process : (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var sanitizedName = sanitizeHtml(post.name)
            var sanitizedProfile = sanitizeHtml(post.profile)
            db.query(`update author set name = ?, profile = ? where id =?`,
                [sanitizedName, sanitizedProfile, post.id ], (error, result) => {
                    if(error) {
                        throw error;
                    }
                    res.writeHead(302, {location: `/author/update/${post.id}`});
                    res.end();
                }
            );
        });
    },
    delete_process:(req, res) => {
        var id = req.params.pageId;
        var login = authStatusUI(req, res);
        if(authIsOwner(req, res) === false){
            return res.end(`<script type='text/javascript'>
                    alert("Login required ~~~")
                    setTimeout("location.href='http://localhost:3000/'",1000);
                    </script>`)
        }
        db.query('DELETE FROM author WHERE id = ?', [id], (error, result) =>{
            if(error) {
                throw error;
            }
            res.writeHead(302, {Location:`/author`});
            res.end();
        });
    }
}