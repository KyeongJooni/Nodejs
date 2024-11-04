const express = require('express');
const router = express.Router();
// 필요한 라우트 추가
router.get('/', (req, res) => {
    res.send('Author Home Page');
});
module.exports = router;