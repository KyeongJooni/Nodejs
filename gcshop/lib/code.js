const db = require('./db');
const sanitizeHtml = require('sanitize-html');

function authIsOwner(req) {
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if (req.session.is_logined) {
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return { name, login, cls };
}

module.exports = {
    view: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        db.query('SELECT * FROM code', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }
            const context = {
                who: name,
                login: login,
                body: 'code.ejs',
                cls: cls,
                codes: results
            };
            req.app.render('mainFrame', context, (err, html) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
                }
                res.end(html);
            });
        });
    },

    create: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const context = {
            who: name,
            login: login,
            body: 'codeCU.ejs',
            cls: cls,
            mode: 'create'
        };
        req.app.render('mainFrame', context, (err, html) => {
            if (err) {
                console.error(err);
                return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
            }
            res.end(html);
        });
    },

    create_process: (req, res) => {
        const post = req.body;
        const sanitizedMainId = sanitizeHtml(post.main_id);
        const sanitizedSubId = sanitizeHtml(post.sub_id);
        const sanitizedMainName = sanitizeHtml(post.main_name);
        const sanitizedSubName = sanitizeHtml(post.sub_name);
        const sanitizedStart = sanitizeHtml(post.start);
        const sanitizedEnd = sanitizeHtml(post.end);

        const sqlInsert = `
            INSERT INTO code (main_id, sub_id, main_name, sub_name, start, end) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [sanitizedMainId, sanitizedSubId, sanitizedMainName, sanitizedSubName, sanitizedStart, sanitizedEnd];
        db.query(sqlInsert, params, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('코드 추가 중 오류가 발생했습니다.');
            }
            res.redirect('/code/view');
        });
    },

    update: (req, res) => {
        const { main, sub, start, end } = req.params;
        const { name, login, cls } = authIsOwner(req);
        const sql = 'SELECT * FROM code WHERE main_id = ? AND sub_id = ? AND start = ? AND end = ?';
        db.query(sql, [main, sub, start, end], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }
            if (results.length === 0) {
                return res.status(404).send('코드를 찾을 수 없습니다.');
            }
            const context = {
                who: name,
                login: login,
                body: 'codeCU.ejs',
                cls: cls,
                code: results[0],
                mode: 'update'
            };
            req.app.render('mainFrame', context, (err, html) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
                }
                res.end(html);
            });
        });
    },

    update_process: (req, res) => {
        const { main_id, sub_id, main_name, sub_name, start, end } = req.body;
        const sql = `
            UPDATE code 
            SET main_name = ?, sub_name = ?, start = ?, end = ? 
            WHERE main_id = ? AND sub_id = ? AND start = ? AND end = ?
        `;
        const params = [main_name, sub_name, start, end, main_id, sub_id, start, end];
        db.query(sql, params, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('코드 업데이트 중 오류가 발생했습니다.');
            }
            res.redirect('/code/view');
        });
    },

    delete_process: (req, res) => {
        const { main, sub, start, end } = req.params;
        const sql = 'DELETE FROM code WHERE main_id = ? AND sub_id = ? AND start = ? AND end = ?';
        db.query(sql, [main, sub, start, end], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('코드 삭제 중 오류가 발생했습니다.');
            }
            res.redirect('/code/view');
        });
    },
};
