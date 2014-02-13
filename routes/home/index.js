var app = require('app')
var path = require('path')
var fs = require('fs')

app.use(function *() {
    this.fileName = path.join(__baseDirname, this.request.path)
    if (yield isFile) {
        this.type = path.extname(this.fileName)
        this.body = fs.createReadStream(this.fileName)
    } else {
        this.body = 'Not Found'
    }
});

function isFile(callback) {
    fs.lstat(this.fileName, function (err, stat) {
        callback(null, stat && stat.isFile())
    })
}
