## 适用于seaJS的一款模块打包工具

### 快速尝试

```bash
git clone https://github.com/xiongsongsong/autoMain.git
cd autoMain
node run
```

####图解

目前唯一的配置项，填写JS模块的根目录：

![2014-03-04 10 42 22](https://f.cloud.github.com/assets/342509/2322022/d552c268-a3ab-11e3-8eaa-4821f8823570.png)

在根目录中存放着JS模块，```不要包装define```

![2014-03-04 11 31 07](https://f.cloud.github.com/assets/342509/2322508/0faa0a74-a3b2-11e3-991d-9a7cf102a811.png)

自动将所有的依赖进行打包

![2014-03-04 11 30 56](https://f.cloud.github.com/assets/342509/2322510/140f3f1c-a3b2-11e3-9f1a-7764ea660fba.png)

增加build参数后，将使用uglifyjs进行压缩，并在对应目录生成.min.js

![2014-03-04 11 31 17](https://f.cloud.github.com/assets/342509/2322511/15e6f29e-a3b2-11e3-8891-d769fcb7fc06.png)

#### TODO

* base可配置```（2014年3月中旬前）```
* 打包CSS以支持seajs-style```（2014年3月）```
* ?build时增加对应的sourceMap```（2014年3月）```
* 变量白名单，默认包含```require,exports,module```,```（2014年3月）```
* require白名单，增加正则配置项```require,exports,module```,```（2014年3月）```

