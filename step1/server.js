//静态服务器的搭建
var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	url = require('url');

function staticRoot(staticPath, req, res){

	var pathObj = url.parse(req.url, true);//parse进行解析
	
	if (pathObj.pathname === '/') {
		pathObj.pathname += 'index.html';
	}

	var filePath = path.join(staticPath, pathObj.pathname);//join进行拼接

	//同步，出现错误服务器会荡掉
	// var fileContent = fs.readFileSync(filePath, 'binary');
	// res.write(fileContent, 'binary');
	// res.end();
	
	//异步
	fs.readFile(filePath, 'binary', function (err, fileContent){
		if (err) {
			res.writeHead(404, 'not found');
			res.end('<h1>404 Not Found</h1>');
		}else{
			res.writeHead(200, 'OK');
			res.write(fileContent, 'binary');
			res.end();
		}
			
	});

}

var server = http.createServer(function (req, res){
	var staticPath = path.resolve(__dirname, 'static');  // path内置模块方法，和join一样，连接作用
	staticRoot(staticPath, req, res);
})

server.listen(8000)
console.log('server start ...');