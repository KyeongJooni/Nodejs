const express = require('express');
var router = express.Router()
var topic = require('../lib/topic');
router.get('/', (req, res) => {
    topic.home(req, res);
})
router.get('/page/:pageId', (req, res) => {
    topic.page(req, res);
})
router.get('/login', (req, res) => {
    topic.login(req, res);
})
router.post('/login_process', (req, res) => {
    topic.login_process(req, res);
})
router.get('/logout_process', (req, res) => {
    topic.logout_process(req, res);
})
router.get('/create', (req, res) => {
    topic.create(req, res);
})
router.post('/create_process', (req, res) => {
    topic.create_process(req, res);
})
router.get('/update/:pageId', (req, res) => {
    topic.update(req, res);
})
router.post('/update_process', (req, res) => {
    topic.update_process(req, res);
})
router.get('/delete/:pageId', (req, res) => {
    topic.delete_process(req, res);
})
module.exports = router;
