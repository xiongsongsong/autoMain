## 适用于seaJS的一款模块打包工具

```目前Base尚不可配置。

### 快速尝试

```bash
git clone https://github.com/xiongsongsong/autoMain.git
cd autoMain
node run
```

####图解

目前唯一的配置项，填写JS模块的根目录：

![2014-03-04 10 42 22](https://f.cloud.github.com/assets/342509/2322022/d552c268-a3ab-11e3-8eaa-4821f8823570.png)

在根目录中，存放者JS模块，如图所示不要包装define

![2014-03-04 10 42 29](https://f.cloud.github.com/assets/342509/2322024/db56f74c-a3ab-11e3-9576-e15ea5e2c3db.png)

自动将所有的依赖进行打包

![2014-03-04 10 43 06](https://f.cloud.github.com/assets/342509/2322025/de1dab24-a3ab-11e3-9705-17f981b3fc5d.png)

增加build参数后，会调用uglifyjs进行压缩

![2014-03-04 10 43 27](https://f.cloud.github.com/assets/342509/2322031/e0d6d71e-a3ab-11e3-977d-e1c5189ccb0c.png)

