var port = 8003

var koa = require('koa');
exports.app = koa();
global.__baseDirname = __dirname

require('./routes')

exports.app.listen(port);


var exec = require('child_process').exec
var OS = require('os')

exec((OS.type().toLowerCase().indexOf('windows') > -1 ? 'start' : 'open') + ' http://localhost:' + port)
