var fs = require('fs')
var path = require('path')

var https = require('https')
var koa = require('koa')

exports.app = koa()
global.__baseDirname = __dirname

require('./routes')
var path = require('path')


https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'server-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'server-cert.pem'))
}, exports.app.callback()).listen(443)


var exec = require('child_process').exec
//var OS = require('os')

///exec((OS.type().toLowerCase().indexOf('windows') > -1 ? 'start' : 'open') + ' http://localhost:' + port)
