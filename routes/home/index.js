var app = require('app')
var path = require('path')
var build = require('build')

app.use(function *() {
    this.fileName = this.request.path
    this.dirName = __baseDirname
    this.body = yield build.start
});
