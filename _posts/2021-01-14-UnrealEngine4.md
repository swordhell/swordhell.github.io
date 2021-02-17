---
layout: post
title: "UnrealEngine4笔记"
subtitle: 'UnrealEngine4笔记'
author: "Abel"
header-style: text
tags:
  - Unreal Engine4
  - C++
---

开一篇文章记录学习Unreal Engine相关知识。参考《虚幻引擎程序设计浅析》ISBN 978-7-121-31349-3，电子工业出版社。带着问题来学习，才能学的快速。看书先需要阅读的就是作者划分的章节目录，反复多看几遍，能从总体上看出知识的结构。

# 第一部分虚幻引擎C++编程

## 第1章 五个类的熟悉

最首先了解5个类，比较关键。

UObject Actor Pawn Controller Character

1. UObject

提供垃圾回收

这个功能和c++标准中的智能指针是冲突的。

反射

相当于实现了java、c#中的反射功能。在本书的第二部分解释了。

序列化

提供无损的加载，序列化方便保存到磁盘或者传递给远端服务器。

与虚幻引擎编辑器的交互

可以在Editor面板里面方便的使用。

运行时类型识别

这个功能也会和C++标准中的RTTI机制：dynamic_cast有冲突。一旦使用，要使用Cast<>函数做类型转换。虚幻号称会提供更加高效的类型识别。

网络复制

在c/s架构中，其被宏标记的变量能够自动完成网络复制。从服务器端复制对应值到客户端。

2. Actor

它能被挂载组件Component。

UE中的Component和unity的是很大的不同。在虚幻里面，Component含义被极大削弱。

3. 灵魂与肉体：Pawn、Character和Controller

Pawn类是提供被操控的特性。它能被Controller操控，Controller可以是用户输入或者AI。Pawn离开操控者无法自主行动的肉体。

Character继承于Pawn。提供了特殊组件，Character Movement组件。提供基础的、基于胶囊体的角色移动，跳跃之类的。

Controller

操控肉体的类，肉体拥有前行、转向、跳跃、开火等函数。类似MVC设计模式。Controller就是管理器，Pawn就是Model，而Pawn挂载的动态网格组件就是View。这个例子也不算太合适能初略建立概念。

## 第2章 需求到实现

# 构建虚拟世界

# 图形和渲染

# 创建交互体验

# 为角色和对象田间动画

# 建立你的开发流程

# 测试并优化你的内容

# 平台开发

# 示例与教学

# UE C++ API手册

# UE 蓝图手册

# UE Python API手册

# 杂项

## 注册虚幻引擎阅读权限

# 参考
- [1] [UnrealEngine4官方文档](https://docs.unrealengine.com/zh-CN/index.html)
- [2] [虚幻引擎官方-B站](https://space.bilibili.com/138827797?spm_id_from=333.788.b_765f7570696e666f.2)
- [3] [虚幻引擎-知乎](https://www.zhihu.com/org/xu-huan-yin-qing-24)
- [4] [虚幻引擎github](https://github.com/EpicGames/UnrealEngine)