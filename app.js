var koa = require('koa');
exports.app = koa();
global.__baseDirname = __dirname

require('./routes')

exports.app.listen(8000);
