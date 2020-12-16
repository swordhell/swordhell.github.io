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

# 在代码里面添加性能监控的代码

```go
import (
	"net/http"
    _ "net/http/pprof"
)
go func() {
    http.ListenAndServe(":10003", nil)
}()
```

# 需要安装环境

```bash
go get -u github.com/google/pprof
```
##### 开篇
编写好了golang服务之后，接着要开始关注服务的CPU，内存使用情况。golang提供了性能剖析工具，记录一些自己搜集到的信息，写下一些实践的情况。在golang中内置了pprof工具，专门来做golang语言的优化。
##### PProf 关注的模块
- CPU profile：报告程序的 CPU 使用情况，按照一定频率去采集应用程序在 CPU 和寄存器上面的数据
- Memory Profile（Heap Profile）：报告程序的内存使用情况
- Block Profiling：报告 goroutines 不在运行状态的情况，可以用来分析和查找死锁等性能瓶颈
- Goroutine Profiling：报告 goroutines 的使用情况，有哪些 goroutine，它们的调用关系是怎样的
##### 尝试
在代码中添加这些内容
```
import (
    ...
	"runtime"
	"runtime/pprof"
	...
)
	var cpuprofile string = "./YZSvr.prof"
	f, err := os.Create(cpuprofile)
	if err != nil {
		logrus.Warn(err.Error())
	}
```

列名 | 含义
---|---
flat | 函数执行消耗时间
flat%| flat占CPU总时间的比例。程序总耗时
sum%|前面每一行的flat占比总和
cum|累计量
cum%|cum占用总时间的比例


```
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
```
生成的svg图片
![1R4KRH.png](https://upload-images.jianshu.io/upload_images/20716125-bdb8ad292b8540bb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

(pprof) callgrind
Generating report in profile010.callgraph.out

安装：
```
go get -u github.com/google/pprof
```
直接使用pprof生成火焰图，在web里面查看：
```
go tool pprof YZSvr.exe YZSvr.prof
```
可以通过修改环境变量直接修改程序里面的线程数目；
export GOMAXPROCS=30


```
pprof.WriteHeapProfile
```

##### 引用
- [火焰图工具网站](https://github.com/uber-archive/go-torch)
- [Golang性能测试工具PProf应用详解](https://zhuanlan.zhihu.com/p/51559344)
- [深度解密go语言之pprof](https://zhuanlan.zhihu.com/p/91241270)
- [graphviz官网](http://graphviz.org/)
- [](https://www.bookstack.cn/read/eddycjy-go/tools-go-tool-pprof.md)
- [qcachegrindwin下载地址](https://sourceforge.net/projects/qcachegrindwin/)