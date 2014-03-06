var app = require('app')
var path = require('path')
var build = require('build')
var fs = require('fs')

app.use(function *() {

        var isAjax = this.header['x-requested-with'] !== undefined

        //check home page
        if (this.request.path === '/' && !isAjax) {
            this.type = 'html'
            this.body = fs.createReadStream(path.join(__dirname, 'index.html'))
            return
        }

        //alias
        if (this.query.alias) {
            global.baseAlias = {}
            this.query.alias.split(/[\r\n]/).forEach(function (key) {
                key = key.split('=')
                if (key.length === 2) {
                    global.baseAlias[key[0].trim()] = key[1].trim()
                }
            })
        } else {
            global.baseAlias = {}
        }

        //vars
        if (this.query.vars) {
            global.baseVars = {}
            this.query.vars.split(/[,，]/).forEach(function (key) {
                key = key.split('=')
                if (key.length === 2) {
                    global.baseVars[key[0].trim()] = key[1].trim()
                }
            })
        }

        if (this.query.dir || this.query.url) {
            global.baseUrl = this.query.url.replace(/(\/|\\)+$/g, '')
            global.baseDir = this.query.dir ? this.query.dir : global.__baseDirname

            if (isAjax) {
                this.type = 'json'
                this.body = this.query
                return
            }
        }

        if (!global.baseUrl || !global.baseDir) {
            this.type = 'json'
            this.body = {err: 'Please complete the setup.'}
            return
        }

        this.fileName = this.request.path
        this.dirName = global.baseDir
        this.rootUrl = global.baseUrl
        this.rootProtocol = this.rootUrl.substring(0, this.rootUrl.indexOf('//') + 2)
        this.filePath = path.join(this.dirName, this.fileName)
        this.filePath = this.filePath + ( path.extname(this.filePath) === '' ? '.js' : '')
        this.mainFilePath = this.filePath
        this.moduleCache = {}

        this.body = yield build.start
    }
)
