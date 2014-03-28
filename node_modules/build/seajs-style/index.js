var fs = require('fs')
var grasp = require('grasp')
var extRe = /css$/i

//找到
module.exports = function *() {
    var self = this
    Object.keys(self.moduleCache).forEach(function (key) {
        var css = grasp.replace('equery', 'require($str)', function ($str) {

            if (extRe.test($str)) {
                return "require('load " + $str + "')"
            } else {
                return "require('" + $str + ")"
            }
        });
        console.log(css('require("a.css")'))
    })
}

function * createStyle() {

}
