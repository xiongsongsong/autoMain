define(function (require, exports, module) {
    console.log(module.id)
    require('./b')
    require('./style.css')
    require('not_exist.js')
})
