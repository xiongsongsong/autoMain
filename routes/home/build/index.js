var fs = require('fs')
var path = require('path')
var qs = require('querystring')
var grasp = require('grasp')
var httpRe = /^http[s]?:\/\//i
var denyRequireRe = /(?:^http[s]?:\/\/|[\s\S]+\.\w+$)/i

// 排除seajs-module中的模块，例如下方模块是不走解析的
//因此，如果一个模块不想被解析，请设置为符合isSeaModulesRe的模式
// require('alipay/xbox/1.1.5/xbox')
// require('alipay/xbox/1.1.5/xbox')
var isSeaModulesRe = /^[^./]/

//入口
exports.start = function *() {

    this.type = path.extname(this.filePath)
    if (yield isFile) {
        //如果不是js文件，则直接返回
        if (/\.(?:js)$/.test(this.filePath.replace(/\?[\s\S]+$/, '')) === false) {
            return fs.createReadStream(this.filePath)
        }

        this.type = 'application/javascript; charset=utf-8';

        //开始读取入口文件
        yield exports.read

        //开始修改define和require
        //注意：不会处理css和html文件，因为他们会被内联处理
        this.returnValue = yield exports.define

        /*
         * 扩展处理
         * */

        // yield require('./seajs-style')

        /*
         * 扩展处理结束
         * */

        return this.returnValue

    } else {
        this.status = 404
        return '/*404 Not Found*/'
    }
}

function addJsExtname(file) {
    return file + (path.extname(file) === '.js' ? '' : '.js')
}

function escapeSlash(id) {
    return id.replace(/\\/g, '/').replace(/(?:\\|\/)$/, '')
}

function removeExtraSlash(dir) {
    return dir.replace(/\\+/g, '/')
}

function replaceConfigVars(id) {
    if (!id) return
    if (global.baseVars) {
        Object.keys(global.baseVars).forEach(function (key) {
            id = id.replace('{' + key + '}', global.baseVars[key])
        })
    }
    return id
}

function checkIsAlias(id) {
    return global.baseAlias && global.baseAlias[id]
}

function replaceConfigAlias(id) {
    return global.baseAlias && global.baseAlias[id] ? global.baseAlias[id] : id
}

//读取文件
exports.read = function (cb) {
    var self = this

    var keys = Object.keys(self.moduleCache)
    var isAllEnd = true
    if (keys.length > 1) {
        for (var i = 0; i < keys.length; i++) {
            if (self.moduleCache[keys[i]].end || self.moduleCache[keys[i]].isAlias) {
                continue
            }
            isAllEnd = false
            self.filePath = self.moduleCache[keys[i]].filePath
            break;
        }
    }


    if (isAllEnd === true && keys.length > 0) {
        cb(null)
        return
    }

    //不能阅读根目录之外的文件
    //todo:在*inx中，目录名允许大小写，因此此处存在问题，考虑到这种情况比较少见，故暂时不考虑
    if (self.filePath.toLowerCase().indexOf(self.dirName.toLowerCase()) !== 0) {
        cb(null, '拒绝访问')
        return;
    }

    fs.lstat(self.filePath, function (err, stat) {
        var cur = self.moduleCache[self.filePath]
        if (stat && stat.isFile()) {
            fs.readFile(self.filePath, function (err, buf) {
                if (cur) {
                    cur.content = buf ? buf.toString() : ''
                    cur.filePath = self.filePath
                } else {
                    cur = self.moduleCache[self.filePath] = {
                        content: buf ? buf.toString() : '',
                        filePath: self.filePath,
                        isMain: true,
                        //todo:此处应该使用base的协议
                        mainUrl: 'https://' + self.header.host + self.url
                    }
                }

                if (!cur.module_id) {
                    cur.module_id = escapeSlash(self.rootUrl +
                            removeExtraSlash(path.join('/' + cur.filePath.substring(self.dirName.length)))
                    )
                }

                //检查是否有新的文件
                try {
                    var list = grasp.search('equery', 'require($id)', buf.toString())
                } catch (e) {
                    console.error(self.filePath + '存在语法错误')
                    console.error(e)
                }
                if (Array.isArray(list)) {
                    if (list.length > 0) cur.moduleCount = list.length
                    list.forEach(function (obj) {
                        obj.arguments.forEach(function (match) {

                            var isAlias = checkIsAlias(match.value)
                            var _file = isAlias ? replaceConfigAlias(match.value) : match.value

                            //check is http[s]:// module.id
                            if (denyRequireRe.test(_file)) {
                                return
                            }

                            //check absolute path
                            if (_file.indexOf('/') === 0) {
                                _file = path.join(global.baseDir, addJsExtname(match.value))
                            } else {
                                _file = path.join(path.dirname(self.filePath), addJsExtname(match.value))
                            }

                            _file = replaceConfigVars(_file)

                            //避免循环引用模块导致的死循环解析
                            if (self.moduleCache[_file]) {
                                return
                            }
                            self.moduleCache[_file] = {
                                filePath: _file,
                                rawRequire: match.value,
                                isAlias: isAlias,
                                module_id: isAlias ? _file : escapeSlash(self.rootUrl +
                                        removeExtraSlash(path.join('/' + _file.substring(self.dirName.length)))
                                )
                            }
                        })
                    })
                }

                cur.end = true

                exports.read.call(self, cb)
            })
        } else {
            cur = self.moduleCache[self.filePath] = {
                filePath: self.filePath,
                end: true
            }
            cur.end = true
            exports.read.call(self, cb)
        }
    })
}

exports.define = function *() {
    var self = this
    Object.keys(self.moduleCache).forEach(function (key) {
        var item = self.moduleCache[key]
        if (!item.content) return;
        var requireReplace = grasp.replace('equery',
            'require($str)',
            'ＳＥＡＪＳＲＥＱＵＩＲＥ___({{_str}})');
        try {
            item.content = requireReplace(item.content).join('')
            item.content = item.content.replace(/ＳＥＡＪＳＲＥＱＵＩＲＥ___\(['"]([\s\S]+?)['"]\)/gm, function (m, m1, m2) {
                if (httpRe.test(m1) || isSeaModulesRe.test(m1)) {
                    return "require('" + m1 + "')"
                }
                if (checkIsAlias(m1)) {
                    return "require('" + replaceConfigAlias(m1) + "')"
                } else {
                    //absolute path
                    if (m1.indexOf('/') === 0) {
                        return "require('" + escapeSlash(global.baseUrl + replaceConfigVars(addJsExtname(m1))) + "')"
                    } else {
                        var id = self.rootProtocol + path.join(path.dirname(item.module_id).substring(self.rootProtocol.length), m1)
                        return "require('" + replaceConfigVars(escapeSlash(addJsExtname(id))) + "')"
                    }
                }
            })

            var type1 = grasp.search('equery', 'define($fn)', item.content);
            var type2 = grasp.search('equery', 'define($id,$fn)', item.content);
            var type3 = grasp.search('equery', 'define($id,$deps,$fn)', item.content);

            if (item.isMain) {
                item.module_id = item.mainUrl
            }
            var defineReplacer = grasp.replace('equery', 'define($fn)', '\r\n;define("' + item.module_id + '",{{fn}});');

            //针对nodejs中模块书写方式(无define包裹时)
            if (type1.length < 1 && type2.length < 1 && type3.length < 1) {
                item.content = '\r\n;define("' + (
                    item.isMain
                        ? item.mainUrl
                        : addJsExtname(item.module_id)
                    ) + '",function(require,exports,module){\r\n' + item.content + '\r\n});\r\n'
            } else {
                //给define($fn)形式的module包装module.id
                if (type1.length > 0) {
                    item.content = defineReplacer(item.content).join('')
                }
            }
        } catch (e) {
            console.error('检查define时发现错误', item.filePath)
            console.error(e)
        }
    })

    return yield save
}

function isFile(callback) {
    fs.lstat(this.filePath, function (err, stat) {
        callback(null, stat && stat.isFile())
    })
}

//保存模块
function save(callback) {

    var self = this

    self.moduleBuffer = Object.keys(self.moduleCache).map(function (key) {
        return self.moduleCache[key].content
    }).join('')

    if (qs.parse(self.url.substring(self.url.indexOf('?') + 1)).build === undefined) {
        callback(null, self.moduleBuffer)
        return
    }
    var filePath = path.join(path.dirname(this.mainFilePath),
            path.basename(this.mainFilePath, '.js') + '.min.js')

    fs.writeFile(filePath, this.moduleBuffer, function () {

        //压缩文件
        var spawn = require('child_process').spawn;
        var ls = spawn('node', ['uglifyjs', filePath, '--output', filePath, '--ascii', '--mangle', '--reserved', 'require,exports,module', '--beautify', 'beautify=false,ascii-only=true'], {
            cwd: path.join(__baseDirname, 'node_modules/uglify-js/bin')
        })

        ls.stdout.on('data', function (data) {
            console.log(data)
        })

        var errData = []
        ls.stderr.on('data', function (data) {
            errData.push(data)
        })

        ls.on('close', function (code) {
            if (code === 0) {
                fs.readFile(filePath, function (err, buf) {
                    callback(null, buf ? buf.toString() : '/* read file error,' + filePath + ' */')
                })
            } else {
                callback(null, '/*' + errData.join('') + '*/')
            }
        })
    })

}
