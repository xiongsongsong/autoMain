var http = require('http')

var path = require('path')
var fs = require('fs')

var mimeMap = {
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    'css': 'text/css',
    'js': 'application/javascript',
    'html': 'text/html'
}

var routes = {
    '/start-build': require
}

http.createServer(function (req, res) {

    var fileName = req.url.replace(/\?.*$/, '')

    if (fileName === '/') {
        fileName = './static/index.html'
    } else {
        fileName = path.join(__dirname, './static', fileName)
    }

    var extName = path.extname(fileName).substring(1)
    res.writeHead(200, {'Content-Type': mimeMap[extName.toLowerCase()] ? mimeMap[extName.toLowerCase()] : 'object/stream'});

    fs.lstat(fileName, function (err, stat) {
        if (err) {
            res.end()
            return
        }
        if (stat.isFile()) {
            fs.createReadStream(fileName).pipe(res);
        } else {
            res.end()
        }

    })

}).listen(3000)
