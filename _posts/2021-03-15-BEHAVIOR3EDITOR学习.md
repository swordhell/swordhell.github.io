---
layout: post
title: "Behavior3Editor学习"
subtitle: 'Behavior3Editor学习'
author: "Abel"
header-style: text
tags:
  - game
  - AI
  - BehaviorTree
---


# 设置梯子

```bat
npm config set registry http://registry.npm.taobao.org

其实就是 .npmrc

registry=http://registry.npm.taobao.org

@REM 将npm的缓存都删除掉
npm cache clear --force

// 配置梯子，否则就会无法安装；
Add the below entry to your .bowerrc:
{
  "proxy":"http://<user>:<password>@<host>:<port>",
  "https-proxy":"http://<user>:<password>@<host>:<port>"
}
```

# 安装环境

通过命令行安装gulp工具。

```bat
npm install gulp-cli -g
npm install gulp -D
npx -p touch nodetouch gulpfile.js
gulp --help
```

# 遇到的问题

```bat
bower sweetalert#~1.0.0-beta              cached https://github.com/t4t5/sweetalert.git#1.0.1
bower sweetalert#~1.0.0-beta            validate 1.0.1 against https://github.com/t4t5/sweetalert.git#~1.0.0-beta
bower fontawesome#~4.3.0                 ECMDERR Failed to execute "git ls-remote --tags --heads https://github.com/FortAwesome/Font-Awesome.git", exit code of #128 fatal: unable 
to access 'https://github.com/FortAwesome/Font-Awesome.git/': Failed to connect to github.com port 443: Timed out

Additional error details:
fatal: unable to access 'https://github.com/FortAwesome/Font-Awesome.git/': Failed to connect to github.com port 443: Timed out

// 配置梯子，否则就会无法安装；
Add the below entry to your .bowerrc:

{
  "proxy":"http://<user>:<password>@<host>:<port>",
  "https-proxy":"http://<user>:<password>@<host>:<port>"
}
```

## node，gulp版本不合

```powershell
PS D:\work\trunk\behavior3editor_bf> gulp serve
ReferenceError: primordials is not defined
    at fs.js:45:5
    at req_ (D:\work\trunk\behavior3editor_bf\node_modules\natives\index.js:143:24)
    at Object.req [as require] (D:\work\trunk\behavior3editor_bf\node_modules\natives\index.js:55:10)
    at Object.<anonymous> (D:\work\trunk\behavior3editor_bf\node_modules\graceful-fs\fs.js:1:37)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Module.require (internal/modules/cjs/loader.js:952:19)
    at require (internal/modules/cjs/helpers.js:88:18)

> node --version
v14.16.0
> gulp -v
CLI version: 2.3.0
Local version: 3.9.1
```

解决方案：

```bat
#安装npm版本控制器
npm install -g n

#切换npm版本到 V10 (v10 版本的npm会安装 node 10)
sudo n v10.19.0

#安装node
npm i -g node

#查看node版本
node --version

#现在node版本切换到了v10了，可以重新安装依赖的
    #重新安装gulp（版本很重要，应该是代码发布时的版本，而不是本地的版本）
    npm i -g gulp@3.9.1 --force
    #重新安装依赖
    npm install

npm install -g nvm

#运行
gulp watch
————————————————
版权声明：本文为CSDN博主「内心毫无波动甚至还想笑」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/yym836659673/article/details/104847572/
```

将node.js降低到 10.x版本，再去匹配 gulp 的版本。

[node.js_10.x版本下载](https://nodejs.org/dist/latest-v10.x/)

## 在做dist的时候，还是会下载electronc

```powershell
Downloading electron-v0.34.2-linux-ia32.zip
[>                                            ] 0.0% (0 B/s)
```

还需要安装：

[electron_v0.30.4下载地址](https://github.com/electron/electron/releases/tag/v0.30.4)

国内下载地址：

[国内源](https://npm.taobao.org/mirrors/electron/0.34.2/)

# 参考
- [1] [Behavior3editor源码](https://github.com/magicsea/behavior3editor)
- [2] [bowerrc配置项目](https://stackoverflow.com/questions/18359887/bower-proxy-configuration)
- [3] [git地址从https转成git](https://stackoverflow.com/questions/15669091/bower-install-using-only-https)
- [4] [解决 ReferenceError: primordials is not defined](https://blog.csdn.net/sunny_desmond/article/details/107506626)