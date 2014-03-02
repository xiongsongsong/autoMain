var app = require('app')
var path = require('path')
var build = require('build')

app.use(function *() {
    this.fileName = this.request.path
    this.dirName = __baseDirname
    this.rootUrl = 'http://localhost:8000/'
    this.rootProtocol = this.rootUrl.substring(0, this.rootUrl.indexOf('//') + 2)
    this.filePath = path.join(this.dirName, this.fileName)
    this.filePath = this.filePath + ( path.extname(this.filePath) === '' ? '.js' : '')
    this.mainFilePath = this.filePath
    console.log(this.filePath)
    this.moduleCache = {}

    this.body = yield build.start
});
