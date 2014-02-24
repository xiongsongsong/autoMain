var app = require('app')
var path = require('path')
var build = require('build')

app.use(function *() {
    this.fileName = this.request.path
    this.dirName = __baseDirname
    this.filePath = path.join(this.dirName, this.fileName)
    this.body = yield build.start
});
