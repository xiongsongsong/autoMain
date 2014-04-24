
module.exports = function*() {
    //读取目录的接口
    if (yield require('./readir')) {

        return true
    }
}
