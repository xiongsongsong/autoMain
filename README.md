## 适用于seaJS的一款简易打包工具

特色之一：模块定义和Node一致，编译时能自动包裹define。

### 快速尝试

```bash
git clone https://github.com/xiongsongsong/autoMain.git
cd autoMain
node run
```

#### 图解

![2014-03-07 12 28 54](https://f.cloud.github.com/assets/342509/2347459/d86301be-a54c-11e3-85a3-0f41ab81ec65.png)

假设在```根目录```中存在init.js，则：


```javascript

//入口文件init.js
define('mainModule',function(){
   require('other-module')
})

//在页面调用
seajs.use('http://localhost:8003/init',function(){
    seajs.use('mainModule')
})

```

如果需要访问压缩的版本，请use```http://localhost:8003/init?build```

当前仅支持seajs.config中```vars```和```paths```。

#### TODO

* 增加开关，以保证始终基于Base进行打包。
* 打包CSS以支持seajs-style 。
* ?build时增加对应的sourceMap。
* 变量白名单，默认包含```require,exports,module```。
* 支持HTTPS

#### 历史

##### 2014-03-05
 * 兼容define

##### 2014-03-06
 * 支持alias和vars配置
 * seaJS.use(id)和返回时的id一致

