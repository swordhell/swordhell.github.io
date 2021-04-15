---
layout: post
title: "golang-pprof性能分析工具"
subtitle: 'pprof'
author: "Abel"
header-style: text
tags:
  - golang
---

编写好了golang服务之后，接着要开始关注服务的CPU，内存使用情况。golang提供了性能剖析工具，记录一些自己搜集到的信息，写下一些实践的情况。在golang中内置了pprof工具，专门来做golang语言的优化。

- [1.安装环境](#1安装环境)
- [2.性能监控代码](#2性能监控代码)
- [3.CPU性能查看](#3cpu性能查看)
- [内存泄漏](#内存泄漏)
- [3.引用](#3引用)

# 1.安装环境

```bash
go get -u github.com/google/pprof
```

需要去下载一个绘图的库。

[Grahpviz](http://www.graphviz.org/)

.gv文件就是dot工具能读取，并且画图的文件格式。

也推荐使用[Graphviz Interactive-VSCode插件](https://marketplace.visualstudio.com/items?itemName=tintinweb.graphviz-interactive-preview)

[vscode-graphviz语法](https://marketplace.visualstudio.com/items?itemName=joaompinto.vscode-graphviz)

# 2.性能监控代码

这段代码将会开启一个http的网站，对外提供监控访问的地址。

```go
import (
	"net/http"
    _ "net/http/pprof"
)
go func() {
    http.ListenAndServe(":10003", nil)
}()
```
[![rL0XUx.png](https://s3.ax1x.com/2020/12/30/rL0XUx.png)](https://imgchr.com/i/rL0XUx)

能通过这个网址检查程序的内存分配，CPU占用，mutex，gorouine之类的信息。可以直接通过浏览器访问获取信息。

- CPU profile：报告程序的 CPU 使用情况，按照一定频率去采集应用程序在 CPU 和寄存器上面的数据
- Memory Profile（Heap Profile）：报告程序的内存使用情况
- Block Profiling：报告 goroutines 不在运行状态的情况，可以用来分析和查找死锁等性能瓶颈
- Goroutine Profiling：报告 goroutines 的使用情况，有哪些 goroutine，它们的调用关系是怎样的

# 3.CPU性能查看

打开一个命令行输入：

```powershell
PS D:\work\trunk\doc> go tool pprof -http=":8081" http://127.0.0.1:10006/debug/pprof/profile?seconds=200
Fetching profile over HTTP from http://127.0.0.1:10006/debug/pprof/profile?seconds=200
Saved profile in C:\Users\xxxxxxxxx\pprof\pprof.samples.cpu.003.pb.gz
Serving web UI on http://localhost:8081
```

在本地将会开启 **-http=":8081"** 表示在8081网站，将会呈现最后结果。这次监控将会抓取 http://127.0.0.1:10006/debug/pprof/profile 提供的性能信息。**?seconds=200** 表示持续抓取200sec。到时间之后它们将会存储到本地的一个文件中： Saved profile in C:\Users\xxxxxxxxx\pprof\pprof.samples.cpu.003.pb.gz 。

想知道这个处理的细节，可以直接阅读golang的源码：

```golang
// C:\Go\src\net\http\pprof\pprof.go
// Profile responds with the pprof-formatted cpu profile.
// Profiling lasts for duration specified in seconds GET parameter, or for 30 seconds if not specified.
// The package initialization registers it as /debug/pprof/profile.
func Profile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-Content-Type-Options", "nosniff")
	sec, err := strconv.ParseInt(r.FormValue("seconds"), 10, 64)
	if sec <= 0 || err != nil {
		sec = 30
	}
}
```

它的接口有两个能支持输入seconds

```doc
"trace":        "A trace of execution of the current program. You can specify the duration in the seconds GET parameter. After you get the trace file, use the go tool trace command to investigate the trace.",
"profile":      "CPU profile. You can specify the duration in the seconds GET parameter. After you get the profile file, use the go tool pprof command to investigate the profile.",
```

通过加载文件来调出分析网站：

```powershell
PS D:\work\trunk\doc> go tool pprof -http=":8989" C:\Users\xxxxxxxxx\pprof\pprof.samples.cpu.003.pb.gz
Serving web UI on http://localhost:8989
```

也能通过这个命令直接加载之前监控的剖析文件。

| 列名  | 含义                                                     |
| :---- | :------------------------------------------------------- |
| flat  | 函数时间（不包括子函数）。这里不包括函数等待子函数返回。 |
| flat% | flat / 总采样时间值                                      |
| sum%  | 前面每一行的flat占比总和                                 |
| cum   | 函数总时间（包括子函数）。因此 flat <= cum               |
| cum%  | cum占用总时间的比例                                      |

火焰图方式

[![rLfQUg.png](https://s3.ax1x.com/2020/12/30/rLfQUg.png)](https://imgchr.com/i/rLfQUg)

调用关系图

[![rL0OV1.png](https://s3.ax1x.com/2020/12/30/rL0OV1.png)](https://imgchr.com/i/rL0OV1)

# 内存泄漏

```bash
curl localhost:8000/debug/pprof/heap > heap.base
curl localhost:8000/debug/pprof/heap > heap.current
go tool pprof -http=:8080 -base heap.base heap.current

    -diff_base source     Source of base profile for comparison
    -base source          Source of base profile for profile subtraction
```

# 3.引用

- [1] [火焰图工具网站](https://github.com/uber-archive/go-torch)
- [2] [Golang性能测试工具PProf应用详解](https://zhuanlan.zhihu.com/p/51559344)
- [3] [深度解密go语言之pprof](https://zhuanlan.zhihu.com/p/91241270)
- [4] [graphviz官网](http://graphviz.org/)
- [5] [Go 大杀器之性能剖析 PProf](https://www.bookstack.cn/read/eddycjy-go/tools-go-tool-pprof.md)
- [6] [qcachegrindwin下载地址](https://sourceforge.net/projects/qcachegrindwin/)
- [7] [golang内存泄漏的排查记录](https://studygolang.com/articles/29812?fr=sidebar)