---
layout: post
title: "虚幻引擎程序设计浅析"
subtitle: '虚幻引擎程序设计浅析'
author: "Abel"
header-style: text
tags:
  - Unreal Engine4
  - C++
  - Game
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

1. 分析需求

使用UML工程建模工具绘制需求分析图。

或者通过沟通分析出来简短的短语。

2. 转化需求为设计

首先从短语中抽象出里面重要的名词，这样就是我们的类。

然后分析出类之间的持有、通信关系。

## 第3章 创建自己的C++类

1. 使用Unreal Editor创建c++类

"内容浏览器" -> "右键" -> "新建C++类"

有一个创建的流程，可以在过程中选择基类。输入名称选择路径。

2. 手动创建C++类

文件目录结构为

```doc
--public/
--private/
--.build.cs
```

头文件放到public文件夹，cpp放入private文件夹。

如果继承了UE的类，需要增加一些宏，否则编译不过。

cpp文件中包含pch文件。

3. 虚幻引擎类命名规则

> F 纯C++类
> U 继承自UObject，但不继承Actor
> A 继承自Actor
> S Slate控件相关类
> H HitResult相关类

Unreal Header Tool 会在编译之前检查这些类名的约束。

## 第4章 对象

1. 类对象的产生

如果是纯C++类型，可以通过new产生。

如果你的类继承自UObject，需要通过NewObject函数来产生。

```cpp
NewObject<T>();
```

如果继承自AActor，需要通过SpawnActor函数产生对象。

```cpp
GetWorld()->SpawnActor<AYourActorClass>();
```

2. 类对象的获取

通过对象的引用或者指针来获取。GetWorld能使用IActorIterator<AACtor>迭代World里面全部的Actor。

3. 类对象的销毁

纯C++类型，就是自己delete就可以了。

UObject的对象，本身有一套内存管理机制，当没有对象引用了，就会触发GC。

Actor的对象，通过Destory函数请求销毁，这个只是说从World里面摘除掉，内存回收还需要靠引擎来决定。

## 第5章 从C++到蓝图

让蓝图调用我的C++类。

1. UPROPERTY宏

将成员变量注册到蓝图中。

2. UFUNCTION宏

注册函数到蓝图中。

## 第6章 游戏性框架概述

### 1. 行为树：
### 2. 虚幻引擎网络框架构

# 注册虚幻引擎阅读权限

可以登录到UE官网，开通github中，开源的UE源码阅读权限。

# 参考
- [1] [UnrealEngine4官方文档](https://docs.unrealengine.com/zh-CN/index.html)
- [2] [虚幻引擎官方-B站](https://space.bilibili.com/138827797?spm_id_from=333.788.b_765f7570696e666f.2)
- [3] [虚幻引擎-知乎](https://www.zhihu.com/org/xu-huan-yin-qing-24)
- [4] [虚幻引擎github](https://github.com/EpicGames/UnrealEngine)