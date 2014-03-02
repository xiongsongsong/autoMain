var app = require('app')
var path = require('path')
var build = require('build')
var fs = require('fs')

app.use(function *() {

        var isAjax = this.header['x-requested-with'] !== undefined

        if (this.request.path === '/' && !isAjax) {
            this.type = 'html'
            this.body = fs.createReadStream(path.join(__dirname, 'index.html'))
            return
        }

        if (this.query.base || this.query.root) {
            global.baseDirname = this.query.root
            global.rootUrl = this.query.base ? this.query.base : global.__baseDirname

            if (isAjax) {
                this.type = 'json'
                this.body = this.query
                return
            }
        }

        if (!global.baseDirname || !global.rootUrl) {
            this.type = 'json'
            this.body = {err: 'Please complete the setup.'}
            return
        }

        this.fileName = this.request.path
        this.dirName = global.baseDirname
        this.rootUrl = global.rootUrl
        this.rootProtocol = this.rootUrl.substring(0, this.rootUrl.indexOf('//') + 2)
        this.filePath = path.join(this.dirName, this.fileName)
        this.filePath = this.filePath + ( path.extname(this.filePath) === '' ? '.js' : '')
        this.mainFilePath = this.filePath
        this.moduleCache = {}

        this.body = yield build.start
    }
)
;
