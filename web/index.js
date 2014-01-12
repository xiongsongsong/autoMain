/**
 * Created by xiongsongsong on 14-1-12.
 */

var fs = require('fs')
fs.lstat(mainFile, function (err, stat) {

    if (err) {
        console.log(err, mainFile)
        return
    }
    if (stat.isDirectory()) {
        require('./directory').main(req, res)
    }
    if (stat.isFile()) {
        require('./file').main(req, res)
    }

})