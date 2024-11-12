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
    // 게시판 타입 목록 보기
    typeview: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const sql = 'SELECT type_id, title, description, write_YN, re_YN, numPerPage FROM boardtype';
        db.query(sql, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }
            const context = {
                who: name,
                login: login,
                body: 'boardtype.ejs',
                cls: cls,
                boardtypes: results
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

    // 게시판 타입 추가 페이지
    typecreate: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const context = {
            who: name,
            login: login,
            body: 'boardtypeCU.ejs',
            cls: cls,
            mode: 'create',
            boardtypes: []  // 빈 배열 추가
        };
        req.app.render('mainFrame', context, (err, html) => {
            if (err) {
                console.error(err);
                return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
            }
            res.end(html);
        });
    },

    // 게시판 타입 추가 처리
    typecreate_process: (req, res) => {
        const post = req.body;
        const sanitizedTitle = sanitizeHtml(post.title);
        const sanitizedDescription = sanitizeHtml(post.description);
        const sanitizedWriteYN = sanitizeHtml(post.write_YN);
        const sanitizedReYN = sanitizeHtml(post.re_YN);
        const sanitizedNumPerPage = parseInt(post.numPerPage, 10);

        const sqlInsert = `
            INSERT INTO boardtype (title, description, write_YN, re_YN, numPerPage) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [sanitizedTitle, sanitizedDescription, sanitizedWriteYN, sanitizedReYN, sanitizedNumPerPage];
        db.query(sqlInsert, params, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('게시판 타입 추가 중 오류가 발생했습니다.');
            }
            res.redirect('/board/type/view?type_id=' + result.insertId);
        });
    },

    // 게시판 타입 수정 페이지
    typeupdate: (req, res) => {
        const typeId = req.params.typeId;  // URL 파라미터에서 가져오기
        const { name, login, cls } = authIsOwner(req);
        const sql = 'SELECT type_id, title, description, write_YN, re_YN, numPerPage FROM boardtype WHERE type_id = ?';
        db.query(sql, [typeId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }
            const context = {
                who: name,
                login: login,
                body: 'boardtypeCU.ejs',
                cls: cls,
                boardtypes: results,
                mode: 'update'
            };
            req.app.render('mainFrame', context, (err, html) => {
                if (err) throw err;
                res.end(html);
            });
        });
    },

    // 게시판 타입 수정 처리
    typeupdate_process: (req, res) => {
        const { type_id, title, description, write_YN, re_YN, numPerPage } = req.body;
        const sql = `
            UPDATE boardtype 
            SET title = ?, description = ?, write_YN = ?, re_YN = ?, numPerPage = ? 
            WHERE type_id = ?
        `;
        const params = [title, description, write_YN, re_YN, parseInt(numPerPage, 10), type_id];
        db.query(sql, params, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('게시판 타입 업데이트 중 오류가 발생했습니다.');
            }
            res.redirect('/board/type/view?type_id=' + type_id);
        });
    },

    // 나머지 함수들은 동일하게 유지...
    typedelete_process: (req, res) => {
        const typeId = req.params.typeId;  // URL 파라미터에서 type_id 가져오기

        // 게시판 타입 삭제 전에 해당 게시판의 게시글도 모두 삭제
        const deletePostsSQL = 'DELETE FROM board WHERE type_id = ?';
        db.query(deletePostsSQL, [typeId], (err) => {
            if (err) {
                console.error('게시글 삭제 중 오류:', err);
                return res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
            }

            // 게시판 타입 삭제
            const deleteBoardTypeSQL = 'DELETE FROM boardtype WHERE type_id = ?';
            db.query(deleteBoardTypeSQL, [typeId], (err) => {
                if (err) {
                    console.error('게시판 타입 삭제 중 오류:', err);
                    return res.status(500).send('게시판 타입 삭제 중 오류가 발생했습니다.');
                }
                res.redirect('/board/type/view');
            });
        });
    },

    view: (req, res) => {
        var sntzedTypeId = sanitizeHtml(req.params.typeId);
        var pNum = req.params.pNum;
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM boardtype where type_id=${sntzedTypeId};`;
        var sql3 = `SELECT COUNT(*) AS total FROM board WHERE type_id=${sntzedTypeId};`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if (error) { throw error; }
            var { name, login, cls } = authIsOwner(req, res);
            var numPerPage = results[1][0].numPerPage;
            var offs = (pNum - 1) * numPerPage;
            var totalPages = Math.ceil(results[2][0].total / numPerPage);
            db.query(`SELECT b.board_id as board_id, b.title as title, b.date as date, p.name as name
                      FROM board b INNER JOIN person p ON b.loginid=p.loginid
                      WHERE b.type_id=? AND b.p_id=? ORDER BY date DESC, board_id DESC
                      LIMIT ? OFFSET ?`, [sntzedTypeId, 0, numPerPage, offs], (error2, boards) => {
                if (error2) { throw error2; }
                var boardtypes = results[0];
                var boardtype = results[1];
                var boardCount = results[2];

                var context = {
                    who: name,
                    login: login,
                    body: 'board',
                    cls: cls,
                    boardtypes: boardtypes,
                    totalPages: totalPages,
                    pNum: pNum,
                    boardtype: boardtype,
                    boardCount: boardCount,
                    boards: boards
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        });
    },
    create: (req, res) => {
        var sntzedTypeId = sanitizeHtml(req.params.typeId);
        var sntzedLoginId = sanitizeHtml(req.session.loginid);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM boardtype WHERE type_id=${sntzedTypeId};`;
        db.query(sql1 + sql2, (error, results) => {
            if (error) { throw error; }
            var { name, login, cls } = authIsOwner(req, res);
            var boardtypes = results[0];
            var boardtype = results[1];

            var context = {
                who: name,
                login: login,
                body: 'boardCRU.ejs',
                cls: cls,
                boardtypes: boardtypes,
                sntzedLoginId: sntzedLoginId,
                boardtype: boardtype,
                mode: 'create'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    create_process: (req, res) => {
        var board = req.body;
        var sntzedTypeId = sanitizeHtml(board.type_id);
        var sntzedLoginId = sanitizeHtml(board.loginid);
        var sntzedPassword = sanitizeHtml(board.password);
        var sntzedTitle = sanitizeHtml(board.title);
        var sntzedContent = sanitizeHtml(board.content);
        db.query('INSERT INTO board(type_id, p_id, loginid, password, title, date, content) VALUES(?, 0, ?, ?, ?, NOW(), ?)',
            [sntzedTypeId, sntzedLoginId, sntzedPassword, sntzedTitle, sntzedContent], (error, result) => {
                if (error) { throw error; }
                res.redirect(`/board/view/${sntzedTypeId}/1`);
            });
    },
    detail: (req, res) => {
        var sntzedBoardId = sanitizeHtml(req.params.boardId);
        var pNum = req.params.pNum;
        var sntzedLoginId = sanitizeHtml(req.session.loginid);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM board INNER JOIN person ON board.loginid=person.loginid WHERE board_id=${sntzedBoardId};`;
        db.query(sql1 + sql2, (error, results) => {
            if (error) { throw error; }
            var { name, login, cls } = authIsOwner(req, res);
            var boardtypes = results[0];
            var board = results[1];

            var context = {
                who: name,
                login: login,
                body: 'boardCRU.ejs',
                cls: cls,
                boardtypes: boardtypes,
                pNum: pNum,
                sntzedLoginId: sntzedLoginId,
                board: board,
                mode: 'read'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    update: (req, res) => {
        var sntzedBoardId = sanitizeHtml(req.params.boardId);
        var sntzedTypeId = sanitizeHtml(req.params.typeId);
        var pNum = req.params.pNum;
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM boardtype WHERE type_id=${sntzedTypeId};`;
        var sql3 = `SELECT * FROM board INNER JOIN person ON board.loginid=person.loginid WHERE board_id=${sntzedBoardId}`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if (error) { throw error; }
            var { name, login, cls } = authIsOwner(req, res);
            var boardtypes = results[0];
            var boardtype = results[1];
            var board = results[2];

            var context = {
                who: name,
                login: login,
                body: 'boardCRU',
                cls: cls,
                boardtypes: boardtypes,
                pNum: pNum,
                boardtype: boardtype,
                board: board,
                mode: 'update'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    update_process: (req, res) => {
        var board = req.body;
        var sntzedTitle = sanitizeHtml(board.title);
        var sntzedContent = sanitizeHtml(board.content);
        var sntzedBoardId = sanitizeHtml(board.board_id);
        var sntzedTypeId = sanitizeHtml(board.type_id);
        var sntzedPassword = sanitizeHtml(board.password);
        var pNum = board.pNum;
        db.query(`SELECT b.type_id as type_id, b.board_id as board_id, b.loginid as loginid, b.password as password, p.class as class
                  FROM board b INNER JOIN person p ON b.loginid=p.loginid WHERE b.board_id=? AND b.type_id=?`, [sntzedBoardId, sntzedTypeId], (error, board) => {
            if (error) { throw error; }
            var { name, login, cls } = authIsOwner(req, res);
            if (cls === 'CST' && sntzedPassword !== board[0].password) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<script language=JavaScript type="text/javascript">
                            alert("비밀번호가 일치하지 않습니다.");
                            setTimeout("location.href='http://localhost:3000/board/update/${sntzedBoardId}/${sntzedTypeId}/${pNum}'", 1000);
                         </script>`);
                return;
            }
            db.query('UPDATE board SET title=?, content=? WHERE board_id=? AND type_id=?',
                [sntzedTitle, sntzedContent, sntzedBoardId, sntzedTypeId], (error2, result) => {
                    if (error2) { throw error; }
                    res.redirect(`/board/detail/${sntzedBoardId}/${pNum}`);
                });
        });
    },
    delete_process: (req, res) => {
        var sntzedBoardId = sanitizeHtml(req.params.boardId);
        var sntzedTypeId = sanitizeHtml(req.params.typeId);
        db.query('DELETE FROM board WHERE board_id=? AND type_id=?', [sntzedBoardId, sntzedTypeId], (error, result) => {
            if (error) { throw error; }
            res.redirect(`/board/view/${sntzedTypeId}/1`);
        });
    }
};