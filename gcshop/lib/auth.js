//auth.js
const db = require('./db');
const sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
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
    // 로그인 페이지 렌더링
    login: (req, res) => {
        var { name, login, cls } = authIsOwner(req, res);
        var context = {
            who: name,
            login: login,
            body: 'login.ejs',
            cls: cls
        };
        req.app.render('mainFrame', context, (err, html) => {
            res.end(html);
        });
    },

    // 로그인 프로세스
    login_process: (req, res) => {
        var post = req.body;
        var sntzedLoginid = sanitizeHtml(post.loginid);
        var sntzedPassword = sanitizeHtml(post.password);
        db.query('SELECT count(*) AS num FROM person WHERE loginid = ? AND password = ?',
            [sntzedLoginid, sntzedPassword], (error, results) => {
                if (results[0].num === 1) {
                    db.query('SELECT name, class, loginid, grade FROM person WHERE loginid = ? AND password = ?',
                        [sntzedLoginid, sntzedPassword], (error, result) => {
                            req.session.is_logined = true;
                            req.session.loginid = result[0].loginid;
                            req.session.name = result[0].name;
                            req.session.cls = result[0].class;
                            req.session.grade = result[0].grade;
                            res.redirect('/');
                        });
                } else {
                    req.session.is_logined = false;
                    req.session.name = 'Guest';
                    req.session.cls = 'NON';
                    res.redirect('/');
                }
            });
    },

    // 로그아웃 프로세스
    logout_process: (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/');
        });
    },

    // 회원가입 페이지 렌더링
    register: (req, res) => {
        if (req.session.is_logined) {
            // 로그인 상태일 경우 '/'로 리다이렉트
            res.redirect('/');
        }
        var { name, login, cls } = authIsOwner(req, res);
        var context = {
            who: name,
            login: login,
            body: 'personCU.ejs',  // 회원가입 페이지 템플릿 이름 수정
            cls: cls,
            userClass: 'CST',      // 기본값으로 클래스 설정
            grade: 'S'             // 기본값으로 학년 설정
        };
        req.app.render('mainFrame', context, (err, html) => {
            res.end(html);
        });
    },

    // 회원가입 프로세스
    register_process: (req, res) => {
        var post = req.body;
        var sntzedLoginid = sanitizeHtml(post.loginid);
        var sntzedPassword = sanitizeHtml(post.password);
        var sntzedName = sanitizeHtml(post.name);
        var sntzedAddress = sanitizeHtml(post.address);
        var sntzedTel = sanitizeHtml(post.tel);
        var sntzedBirth = sanitizeHtml(post.birth);

        // 기본값 설정
        const userClass = 'CST'; // 하드코딩된 클래스
        const grade = 'S';       // 하드코딩된 학년

        // DB에 회원 정보 저장
        const sqlCheck = 'SELECT count(*) AS num FROM person WHERE loginid = ?';
        db.query(sqlCheck, [sntzedLoginid], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('회원 가입 중 오류가 발생했습니다.');
            }

            // 이미 존재하는 사용자 확인
            if (results[0].num > 0) {
                req.session.is_logined = false;
                req.session.name = 'Guest';
                req.session.cls = 'NON';
                return res.status(400).send('이미 존재하는 아이디입니다.');
            }

            // 새로운 사용자 등록
            const sqlInsert = `
                INSERT INTO person (loginid, password, name, address, tel, birth, class, grade) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            var params = [sntzedLoginid, sntzedPassword, sntzedName, sntzedAddress, sntzedTel, sntzedBirth, userClass, grade];
            db.query(sqlInsert, params, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('회원 가입 중 오류가 발생했습니다.');
                }
                // 가입 후 메인 페이지로 이동
                req.session.is_logined = true;
                req.session.loginid = sntzedLoginid;
                req.session.name = sntzedName;
                req.session.cls = userClass;
                req.session.grade = grade;
                res.redirect('/');
            });
        });
    },
};