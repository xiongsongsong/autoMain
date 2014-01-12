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

http.createServer(function (req, res) {

    var fileName = req.url.replace(/\?.*$/, '')

    if (fileName === '/') {
        fileName = './static/index.html'
    } else {
        fileName = path.join(__dirname, './static', fileName)
    }

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

