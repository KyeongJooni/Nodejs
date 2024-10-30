const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const topic = require('./lib/topic');
const author = require('./lib/author');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return topic.home(req, res);
    }

    fs.readdir('./lib', function (error, filelist) {
        if (error) {
            console.error("Error reading directory:", error);
            return res.status(500).send("Internal Server Error");
        }

        fs.readFile(filePath, 'utf8', function (error, description) {
            if (error) {
                console.error("Error reading file:", error);
                return res.status(404).send("File not found");
            }
            res.send(description);
        });
    });
});

app.get('/page/:pageId', (req, res) => {
    topic.page(req, res);
})

app.get('/create', (req, res) => {
    topic.create(req, res);
})

app.post('/create_process', (req, res) => {
    topic.create_process(req, res);
})

app.get('/update/:pageId', (req, res) => {
    topic.update(req, res);
})

app.post('/update_process', (req, res) => {
    topic.update_process(req, res);
})

app.get('/delete/:pageId', (req, res) => {
    topic.delete(req, res);
});

app.get('/author', (req, res) => {
    author.create(req, res);
})

app.post('/author/create_process', (req, res) => {
    author.create_process(req, res);
})

app.get('/author/update', (req, res) => {
    author.update(req, res);
})

app.get('/author/update/:authorId', (req, res) => {
    author.update(req, res);
})

app.post('/author/update_process', (req, res) => {
    author.update_process(req, res);
})

app.get('/author/delete/:authorId', (req, res) => {
    author.delete(req, res);
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(3000, () => console.log('Example app listening on port 3000'));