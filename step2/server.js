var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	url = require('url');

var routes = {
	'/a': function(req, res){
		res.end('match /a, query is:' + JSON.stringify(req.query));
	},
	'/b': function(req, res){
		res.end('match /b');
	},
	'/a/c': function(req, res){
		res.end('match /a/c');
	},
	'/search': function(req, res){
		res.end('username='+req.body.username+'&password='+req.body.password);
	}
};

var server = http.createServer(function (req, res){
	routePath(req, res);
});

server.listen(8000)
console.log('server start ...');

function routePath(req, res){
	var pathObj = url.parse(req.url, true);
	var handleFn = routes[pathObj.pathname];
	
	if (handleFn) {
		//get json解析
		req.query = pathObj.query;

		// post json解析
		var body = '';
		req.on('data', function(chunk){
			body += chunk;
		}).on('end', function(){
			req.body = parseBody(body);
			handleFn(req, res);
		});
	}else {
		staticRoot(path.resolve(__dirname, 'static'), req, res);
	}
}

function staticRoot(staticPath, req, res){

	var pathObj = url.parse(req.url, true);//parse进行解析
	var filePath = path.join(staticPath, pathObj.pathname);//join进行拼接

	fs.readFile(filePath, 'binary', function(err, fileContent){
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

function parseBody(body){
	var obj = {};
	body.split('&').forEach(function(str){
		obj[str.split('=')[0]] = str.split('=')[1];
	});
	return obj;
}