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
---

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
