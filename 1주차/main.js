var http = require('http');
var app = http.createServer( function(req,res){ 
// 여기에 클라이언트의 요청을 받아서 URL을 분류하고
// URL에 따른 controller에 해당하는 로직을 작성
res.writeHead(200); 
res.end("Hello. My response, Node.js !!!")
});
app.listen(3000);