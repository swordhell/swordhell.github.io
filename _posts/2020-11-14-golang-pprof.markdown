---
layout: post
title: "Golang-pprof性能分析工具"
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
