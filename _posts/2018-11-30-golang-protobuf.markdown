---
layout: post
title: "golang protobuf 尝试"
subtitle: '尝试使用在golang里面使用protobuf'
author: "Abel"
header-style: text
tags:
  - protobuf
  - golang
---
protobuf是比较好的一种序列化的工具，这里使用golang来试用一下protobuf
---


 [protobuf模块](https://github.com/golang/protobuf)  [参考文档](https://developers.google.com/protocol-buffers/docs/gotutorial) 


# 准备工具
![图例]( "/img/pic/20181201080640-install-go-protocol1.png")
![图例]( "/img/pic/20181201080640-install-go-protocol2.png")
![图例]( "/img/pic/20181201080640-install-go-protocol3.png")

# 定义protobuf

```protobuf
syntax = "proto2";
package example;

enum FOO { X = 17; };

message Test {
    required string label = 1;
    optional int32 type = 2 [default=77];
    repeated int64 reps = 3;
}
```
