## 自动打包项目内依赖的一款小工具

## 哪些会被打包

```javascript
require('./a') //yes
require('../a') //yes
require('./../a') //yes
require('../../a') //yes
require('a') //no
```

所有采用相对路径的模块，均会被打包。