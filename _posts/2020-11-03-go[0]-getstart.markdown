---
layout: post
title: "learn_getstart"
subtitle: '入门'
author: "Abel"
header-style: text
tags:
  - golang
---
学习golang的入门的信息；本章只记录一下golang语言的历史。大量资料都来自于网上收集。

## 历史

Go语言（或 Golang）起源于 2007 年，并在 2009 年正式对外发布。Go 是非常年轻的一门语言，它的主要目标是“兼具 Python 等动态语言的开发速度和 C/C++ 等编译型语言的性能与安全性”。

## 环境部署

[官方网站](https://golang.org/)

### Linux

```bash
tar -C /usr/local -xzf go1.15.3.linux-amd64.tar.gz
# 设置环境变量
/etc/profile
$HOME/.profile
export PATH=$PATH:/usr/local/go/bin
```

### Windows

直接通过安装包安装；

### 需要配置的环境变量

```
GOPATH=D:\work\gopath
export GOPROXY=https://goproxy.io,https://goproxy.cn,direct
```

## 参考

- [1] [Go语言菜鸟](https://www.runoob.com/go/go-tutorial.html)
- [2] [Go语言入门](http://c.biancheng.net/golang/)
###### linux环境搭建
先解压缩golang的包
```
tar -xf ./go.1.xxx.tar.gz -C /usr/local
```
使用go env查询具体的环境信息。通过编辑~/.bashrc文件的环境变量来修改配置。

###### go build

参数 | 说明 | 示例 |
---|---|---
-o | 可执行文件名| |
-a | 强制重编译所有包()包含标准库| |
-p|并行编译使用CPU核心数||
-v|显示等待编译包名||
-n|显示编译命令，但不执行||
-x|显示正在执行的编译命令||
-work|显示临时工作目录，完成后不删除|
-race|启动数据竞争检查（旨在amd64||
-gcflags |编译器参数||
-ldflags |链接器参数||

编译器选项
参数|说明
---|---
-B | 禁用越界检查
-N| 禁用优化
-l | 禁用内联
-u | 禁用unsafe
-S | 输出汇编代码
-m | 输出优化信息

ldflags:
参数|说明
---|---
-s | 禁用符号表
-w | 禁用DRAWF调试信息
-X | 设置字符串全局变量值   -X ver="0.99"
-H | 设置可执行文件格式 -H windowsgui

详细参数可以通过
go tool compile -h
go tool link -h
获取更多信息也可以直接到
src/cmd/[compile|link]
目录下阅读doc.go文档。

###### go install
参数和go build一致，只是将编译结果安装到bin/pkg目录中。go install支持增量编译。如果没有修改，将会直接链接pkg目录中的静态包。编译器用buildid检查文件清单和导入依赖。
算法源码可以阅读
src/cmd/go/pkg.go

###### go get
下载第三方包到GOPATH列表中第一个工作目录。
参数|说明
---|---
-d | 仅下载，不安装
-u | 更新包，包括其依赖项
-f | 和-u配合，强制更新，不检测过期与否
-t | 下载测试代码所需的依赖包
-insecure | 使用HTTP非安全协议
-v | 输出详细信息verbose
-x | 显示正在执行的命令

###### go env
显示全部环境变量
```
set GO111MODULE=
set GOARCH=amd64
set GOBIN=
set GOCACHE=C:\Users\abel\AppData\Local\go-build
set GOENV=C:\Users\abel\AppData\Roaming\go\env
set GOEXE=.exe
set GOFLAGS=
set GOHOSTARCH=amd64
set GOHOSTOS=windows
set GONOPROXY=
set GONOSUMDB=
set GOOS=windows
set GOPATH=C:\main\code\fanghaoli\server
set GOPRIVATE=
set GOPROXY=https://goproxy.cn
set GOROOT=c:\go
set GOSUMDB=sum.golang.org
set GOTMPDIR=
set GOTOOLDIR=c:\go\pkg\tool\windows_amd64
set GCCGO=gccgo
set AR=ar
set CC=gcc
set CXX=g++
set CGO_ENABLED=1
set GOMOD=
set CGO_CFLAGS=-g -O2
set CGO_CPPFLAGS=
set CGO_CXXFLAGS=-g -O2
set CGO_FFLAGS=-g -O2
set CGO_LDFLAGS=-g -O2
set PKG_CONFIG=pkg-config
set GOGCCFLAGS=-m64 -mthreads -fno-caret-diagnostics -Qunused-arguments -fmessage-length=0 -fdebug-prefix-map=C:\Users\abel\AppData\Local\Temp\go-build072770210=/tmp/go-build -gno-record-gcc-switches
```

###### go clean
清理工作目录，伤处编译和安装遗留的目标文件
参数|说明
---|---
-i | 清理go install 安装的文件
-r | 递归清理所有依赖包
-x | 显示在执行的清理操作
-n | 仅显示清理命令，不执行

###### 编译
如果喜欢使用gdb调试，一般需要使用 -gcflags "-N-l"阻止优化和内联，否则调试的时候会找不到调试信息。
当发布是，参数-ldflags "-w-s"会让连机器剔除掉符号表和调试信息，除了可以减少可执行文件的大小外，还能稍微增加反编译的难度。可以借助工具来对可执行文件进行减肥upx 

###### 交叉编译
corss compile，就是在一个平台下出其他平台所需的可执行文件。只需要使用GOOS、GOARCH来调整环境变量指定平台和架构。
go env GOOS
使用go install命令为目标平台预编译好标准库，避免go build每次都完整编译。
交叉编译不支持cgo。

编写一个build_linux.bat文件
```bat
set GOARCH=amd64
set GOOS=linux
go build
```

跨平台编译需要下载一些库。
```
https://github.com/golang/crypto.git
https://github.com/golang/net.git
https://github.com/golang/sys.git
https://github.com/golang/tools.git
```
解压缩之后放到这个目录下：
```
$GOPATH/src/golang.org/x
```

###### 条件编译
编译器支持文件级别的条件编译。

1.将平台和架构信息添加到文件名尾部。

hello_darwin.go hello_linux.go 测试一下
GOOS=darwin.go build -x
将会只编译hello_darwin.go。
也可以对架构做条件
sys_arm64.go sys_darwin_3866.s sys_freebsd_amd64.s
文件名中可以使用GOOS,或者加上GOARCH。

2.使用build编译命令。

a.go
```go
// +build windows
       <---必须有空行
       
package main
func hello() {
    println("xxxx")
}
```
b.go
```
// +build linux darwin
// +build 386,/!cgo

package main
....
}
```

3.使用自定义tag指令。

// +build !release
// +build log


go build-tags "release log" && ./xxxx
