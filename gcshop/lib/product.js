var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if (req.session.is_logined) {
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return { name, login, cls }
}

module.exports = {
    view: (req, res) => {
        var sql1 = 'SELECT * FROM product;';
        var sql2 = 'SELECT * FROM boardtype;';
        db.query(sql1 + sql2, (error, results) => {
            if (error) { throw error; }
            var { name, login, cls } = authIsOwner(req, res);
            var products = results[0];
            var boardtypes = results[1];

            var context = {
                who: name,
                login: login,
                body: 'product.ejs',
                cls: cls,
                boardtypes: boardtypes,
                /* --- product.ejs에 넘겨줄 변수 --- */
                products: products,
                path: 'product'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    create: (req, res) => {
        var sql1 = 'SELECT * FROM code;';
        var sql2 = 'SELECT * FROM boardtype;';
        db.query(sql1 + sql2, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }

            var { name, login, cls } = authIsOwner(req, res);
            var categorys = results[0];  // categories -> categorys로 수정
            var boardtypes = results[1];

            var context = {
                who: name,
                login: login,
                body: 'productC.ejs',
                cls: cls,
                boardtypes: boardtypes,
                categorys: categorys,  // categories -> categorys로 수정
                mode: 'create',
                mer: null  // mer 변수 추가 (템플릿에서 사용됨)
            };

            res.render('mainFrame', context, (err, html) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
                }
                res.end(html);
            });
        });
    },

    create_process: (req, res) => {
        const post = req.body;

        const sanitizedCategory = sanitizeHtml(post.category);
        const sanitizedMainId = sanitizedCategory.substr(0, 4);
        const sanitizedSubId = sanitizedCategory.substr(4, 4);
        const sanitizedName = sanitizeHtml(post.name);
        const sanitizedPrice = sanitizeHtml(post.price);
        const sanitizedStock = sanitizeHtml(post.stock);
        const sanitizedBrand = sanitizeHtml(post.brand);
        const sanitizedSupplier = sanitizeHtml(post.supplier);
        const sanitizedSaleYn = sanitizeHtml(post.sale_yn);
        const sanitizedSaleprice = sanitizeHtml(post.sale_price);

        const sanitizedimageFilePath = sanitizeHtml(req.file ? `/image/${req.file.filename}` : null);

        const sqlInsert = `
            INSERT INTO product (main_id, sub_id, name, price, stock, brand, supplier, image, sale_yn, sale_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            sanitizedMainId, sanitizedSubId, sanitizedName, sanitizedPrice,
            sanitizedStock, sanitizedBrand, sanitizedSupplier, sanitizedimageFilePath,
            sanitizedSaleYn, sanitizedSaleprice
        ];

        db.query(sqlInsert, params, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('제품 추가 중 오류가 발생했습니다.');
            }
            res.redirect('/product/view'); 
        });
    },

    update: (req, res) => {
        const sntzedMerId = sanitizeHtml(req.params.merId);

        const sql1 = 'SELECT * FROM boardtype;';
        const sql2 = 'SELECT main_id, sub_id, main_name, sub_name FROM code;';
        const sql3 = 'SELECT * FROM product WHERE mer_id = ?';

        db.query(sql1 + sql2 + sql3, [sntzedMerId], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }

            const { name, login, cls } = authIsOwner(req, res);
            const boardtypes = results[0];
            const categories = results[1];
            const product = results[2][0];  // 단일 제품 정보만 필요하므로 첫 번째 결과만 사용

            const context = {
                who: name,
                login: login,
                body: 'productU.ejs',
                cls: cls,
                boardtypes: boardtypes,
                categories: categories,
                product: product,
                mode: 'update'
            };

            res.render('mainFrame', context, (err, html) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
                }
                res.end(html);
            });
        });
    },

    update_process: (req, res) => {
        var product = req.body;
        var sntzedCategory = sanitizeHtml(product.category);
        var main_id = sntzedCategory.substr(0, 4);
        var sub_id = sntzedCategory.substr(4, 4);
        var mer_id = sanitizeHtml(product.mer_id);
        var sntzedName = sanitizeHtml(product.name);
        var sntzedPrice = parseInt(sanitizeHtml(product.price));
        var sntzedStock = parseInt(sanitizeHtml(product.stock));
        var sntzedBrand = sanitizeHtml(product.brand);
        var sntzedSupplier = sanitizeHtml(product.supplier);
        var sntzedFile = product.image;
        var sntzedSaleYn = sanitizeHtml(product.sale_yn);
        var sntzedSalePrice = parseInt(sanitizeHtml(product.sale_price));
        if (isNaN(sntzedSalePrice)) { sntzedSalePrice = 0; }
        db.query(`UPDATE product SET main_id=?, sub_id=?, name=?, price=?, stock=?, brand=?, supplier=?, image=?, sale_yn=?, sale_price=?
                  WHERE mer_id=?`,
            [main_id, sub_id, sntzedName, sntzedPrice, sntzedStock, sntzedBrand, sntzedSupplier, sntzedFile, sntzedSaleYn, sntzedSalePrice, mer_id], (error, result) => {
                if (error) { throw error; }
                res.redirect('/product/view');
            });
    },
    delete_process: (req, res) => {
        var sntzedMerId = sanitizeHtml(req.params.merId);
        db.query('DELETE FROM product WHERE mer_id=?', [sntzedMerId], (error, result) => {
            if (error) { throw error; }
            res.redirect('/product/view');
        });
    }
}