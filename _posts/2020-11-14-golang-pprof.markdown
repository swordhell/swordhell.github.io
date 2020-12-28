---
layout: post
title: "golang-pprof性能分析工具"
subtitle: 'pprof'
author: "Abel"
header-style: text
tags:
  - Linux
  - bash
---
记录一下pprof查询golang性能相关；

# 1.在代码里面添加性能监控的代码

```go
import (
	"net/http"
    _ "net/http/pprof"
)
go func() {
    http.ListenAndServe(":10003", nil)
}()
```

# 2.需要安装环境

```bash
go get -u github.com/google/pprof
```

## 2.1.开篇

编写好了golang服务之后，接着要开始关注服务的CPU，内存使用情况。golang提供了性能剖析工具，记录一些自己搜集到的信息，写下一些实践的情况。在golang中内置了pprof工具，专门来做golang语言的优化。
## 2.2.PProf 关注的模块

- CPU profile：报告程序的 CPU 使用情况，按照一定频率去采集应用程序在 CPU 和寄存器上面的数据
- Memory Profile（Heap Profile）：报告程序的内存使用情况
- Block Profiling：报告 goroutines 不在运行状态的情况，可以用来分析和查找死锁等性能瓶颈
- Goroutine Profiling：报告 goroutines 的使用情况，有哪些 goroutine，它们的调用关系是怎样的

## 2.3.尝试

在代码中添加这些内容

```golang
import (
    ...
	"runtime"
	"runtime/pprof"
	// ...
)
	var cpuprofile string = "./YZSvr.prof"
	f, err := os.Create(cpuprofile)
	if err != nil {
		logrus.Warn(err.Error())
	}
```

| 列名  | 含义                              |
| :---- | :-------------------------------- |
| flat  | 函数执行消耗时间                  |
| flat% | flat占CPU总时间的比例。程序总耗时 |
| sum%  | 前面每一行的flat占比总和          |
| cum   | 累计量                            |
| cum%  | cum占用总时间的比例               |

```bash
(pprof) top10
Showing nodes accounting for 7.47s, 73.60% of 10.15s total
Dropped 136 nodes (cum <= 0.05s)
Showing top 10 nodes out of 53
      flat  flat%   sum%        cum   cum%
     5.93s 58.42% 58.42%      5.98s 58.92%  runtime.stdcall1
     0.33s  3.25% 61.67%      2.04s 20.10%  runtime.timerproc
     0.30s  2.96% 64.63%      0.30s  2.96%  runtime.stdcall2
     0.23s  2.27% 66.90%      0.23s  2.27%  runtime.casgstatus
     0.14s  1.38% 68.28%      0.47s  4.63%  runtime.schedule
     0.14s  1.38% 69.66%      7.10s 69.95%  runtime.systemstack
     0.12s  1.18% 70.84%      0.13s  1.28%  runtime.(*mcache).prepareForSweep
     0.10s  0.99% 71.82%      0.19s  1.87%  octopus.com/octserver/YZSvr/yz_db.(*SYzDb).GetResult

top5用于显示消耗 CPU 前五的函数，每一行代表一个函数，每一列为一项指标:

    flat: 采样时，该函数正在运行的次数*采样频率(10ms)，即得到估算的函数运行”采样时间”。这里不包括函数等待子函数返回。
    flat%: flat / 总采样时间值
    sum%: 前面所有行的 flat% 的累加值，如第二行 sum% = 20.82% = 11.12% + 9.70%
    cum: 采样时，该函数出现在调用堆栈的采样时间，包括函数等待子函数返回。因此 flat <= cum
    cum%: cum / 总采样时间值

作者：红烧不是清蒸
链接：https://juejin.cn/post/6844903588565630983
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

生成的svg图片

![1R4KRH.png](https://upload-images.jianshu.io/upload_images/20716125-bdb8ad292b8540bb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```bash
(pprof) callgrind
Generating report in profile010.callgraph.out
```

安装：

```bash
$ go get -u github.com/google/pprof

# 直接将火焰图调出来：
D:\work\trunk\new_project_server\server\bin>go tool pprof profile
Type: cpu
Time: Dec 26, 2020 at 10:44am (CST)
Duration: 30.18s, Total samples = 12.16s (40.29%)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) web

# 直接使用pprof生成火焰图，在web里面查看：
$ go tool pprof YZSvr.exe YZSvr.prof

# 可以通过修改环境变量直接修改程序里面的线程数目；
$ export GOMAXPROCS=30
# 直接写当前的 heap 的信息
pprof.WriteHeapProfile

# 本地抓取远程机器监控 CPU
go tool pprof -http=":8081" http://172.16.11.92:10006/debug/pprof/profile?seconds=200

PS D:\work\trunk\doc> go tool pprof -http=":8081" http://172.16.11.92:10006/debug/pprof/profile?seconds=200
Fetching profile over HTTP from http://172.16.11.92:10006/debug/pprof/profile?seconds=200
Saved profile in C:\Users\xiaozanbiao\pprof\pprof.Scene.samples.cpu.001.pb.gz
Serving web UI on http://localhost:8081

抓取远程的服务器的状态，seconds=200，就是指的抓取200秒。

go tool pprof profile C:\Users\user\pprof\pprof.samples.cpu.004.pb.gz

# 可以直接指定本地的pprof文件，然后用web方式来呈现
go tool pprof -http=":8081" profile C:\Users\xiaozanbiao\pprof\pprof.Scene.samples.cpu.001.pb.gz

# 本地抓取远程机器的内存

$ go tool pprof -http=":8081" http://172.16.11.92:10006/debug/pprof/heap?debug=1

PS D:\work\trunk\doc> go tool pprof -http=":8081" http://172.16.11.92:10006/debug/pprof/heap?debug=1
Fetching profile over HTTP from http://172.16.11.92:10006/debug/pprof/heap?debug=1
Saved profile in C:\Users\xiaozanbiao\pprof\pprof.alloc_objects.alloc_space.inuse_objects.inuse_space.006.pb.gz
Serving web UI on http://localhost:8081

# 2020/12/26 监控Level服务器的cpu剖析信息
pprof.Scene.samples.cpu.002.pb.gz

```

# 3.引用

- 1. [火焰图工具网站](https://github.com/uber-archive/go-torch)
- 2. [Golang性能测试工具PProf应用详解](https://zhuanlan.zhihu.com/p/51559344)
- 3. [深度解密go语言之pprof](https://zhuanlan.zhihu.com/p/91241270)
- 4. [graphviz官网](http://graphviz.org/)
- 5. [Go 大杀器之性能剖析 PProf](https://www.bookstack.cn/read/eddycjy-go/tools-go-tool-pprof.md)
- 6. [qcachegrindwin下载地址](https://sourceforge.net/projects/qcachegrindwin/)
  