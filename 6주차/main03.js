const express = require('express');
const app = express();
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
var fs = require('fs');
var url = require('url');
var path = require('path');
app.get('/',(req,res)=>{
    var _url = req.url;
    var queryData = url.parse(_url,true).query;
    console.log(queryData.id)
    console.log(path.parse(queryData.id));  // 1. 
    fs.readdir('./lib',function(error, filelist){
        console.log(filelist);
        // fs.readFile(`lib/${queryData.id}`,'utf8',function(error,description){  // 2. 이것을 주석처리 하고 1.을 실행
        fs.readFile(`lib/${path.parse(queryData.id).base}`,'utf8',function(error,description){  // 1.
            console.log(description)
            res.end(description)
        })
    })}
)

app.get('/favicon.ico', (req,res)=>res.writeHead(404));
app.listen(3000, ()=>console.log('Example app listening on port 3000'));