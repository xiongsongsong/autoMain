var http = require('http')

var config = require('./config')
var path = require('path')
var fs = require('fs')

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Hello World\n')

    var url = req.url.replace(/\?.+$/, '')
    var qs = req.url.substring(req.url.indexOf('?') + 1)

    console.log(url)
    console.log(qs)

    var mainFile = path.join(config.dirname, url)

    fs.lstat(mainFile, function (err, stat) {

        if (err) {
            console.log(err, mainFile)
            return
        }
        //if directory
        console.log(stat.isDirectory())

    })

}).listen(3000)

