var fs = require('fs')
var path = require('path')

module.exports = function*() {
    if (/^\/readir(.+)/.test(this.path) === false) {
        return
    }
    this.rootDir = path.join(global.baseDir ? global.baseDir : global.__baseDirname, RegExp.$1 ? RegExp.$1 : '')
    var arr = yield readDir
    for (var i = 0; i < arr.length; i++) {
        this.currentFile = arr[i]
        arr[i] = yield readStat
    }

    this.body = JSON.stringify(arr, undefined, 4)
    return true

}

function readDir(callback) {
    fs.readdir(this.rootDir, function (err, list) {
        if (err) {
            callback(null, [])
        } else {
            callback(null, list)
        }
    })
}

function readStat(callback) {
    var filePath = path.join(this.rootDir, this.currentFile)
    fs.stat(path.join(this.rootDir, this.currentFile), function (err, stat) {
        if (err) {
            callback(null, {})
        } else {
            callback(null, {
                path: filePath,
                isFile: stat.isFile(),
                isDirectory: stat.isDirectory(),
                size: stat.size,
                atime: stat.atime,
                mtime: stat.mtime,
                ctime: stat.ctime
            })
        }
    })
}