---
layout: post
title: "虚幻引擎程序设计浅析"
subtitle: '虚幻引擎程序设计浅析'
author: "Abel"
header-style: text
tags:
  - Unreal Engine4
  - Game
---

开一篇文章记录学习Unreal Engine相关知识。参考《虚幻引擎程序设计浅析》ISBN 978-7-121-31349-3，电子工业出版社。带着问题来学习，才能学的快速。看书先需要阅读的就是作者划分的章节目录，反复多看几遍，能从总体上看出知识的结构。

# 第一部分 虚幻引擎C++编程

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

### 1. 行为树：概念与原理

1. 为什么选择行为树

ue3框架是状态机制作的，还引入了Unreal Script脚本来扩展。在ue4直接被行为树系统替换。状态机只在动画蓝图中保留。

粗俗来说，行为树特点：“逐个尝试，不行就换”的思路。更加符合人的思维方式。

2. 行为树原理

三种节点：

> 流程控制：包含Selector选择器和Sequence顺序执行器。
> 装饰器：对子树的返回值进行处理的节点。
> 执行节点：干活的节点，返回trun或者false，running。

可以参考之前写过的行为树的文档，里面也有if语句，&&||的逻辑运算，挂起唤醒逻辑，循环逻辑等等。是一种使用可视化方式提供给别人来编写程序的一种方法。

### 2. 虚幻引擎网络框架构

1. 同步

多人在线的同步问题，是通过一台*权威服务器*来负责将数据收集起来，并且分发给客户端。让作弊变得困难。

> 指令：对于游戏世界造成影响的请求。egg：人物前移3米，人物挥刀碰到了怪物
> 状态：游戏世界的各种数值状态。egg：当前人物生命值，当前怪物生命值。

客户端只能向服务器发送“指令”，服务器根据指令处理之后，改变游戏世界的状态，并且将状态*同步*给每个客户端。

2. 广义的客户端-服务器模型

> 客户端是对服务器的拙劣模仿 --- 虚幻官方文档UDN中描述
> “拙劣”二字，表示是服务器的世界是正确的，而客户端则是不断试图猜测服务器当前的状态，并且模仿。

## 第7章 引擎系统相关类

本章主要介绍一些虚幻引擎4提供的一些类，防止程序重复造轮子。

### 7.1 正则表达式

```cpp
#include "Regex.h"
FString TextStr("AAAABBBBB");
FRegexPattern TestPattern(TEXT("C.+H"));
FRegexMatcher xxx;
```

[FRegexPattern手册](https://docs.unrealengine.com/en-US/API/Runtime/Core/Internationalization/FRegexPattern/index.html)

基本上能满足匹配，抓取之类的操作。

### 7.2 FPaths

获取游戏的根目录；判断文件是否存在；路径转换成绝对路径类似的功能。

[FPaths官方文档](https://docs.unrealengine.com/en-US/API/Runtime/Core/Misc/FPaths/index.html)

### 7.3 XML/JSON

FXmlFile/FastXML访问XML数据；

TJsonReaderFactory<TCHAR>/TJsonReader<TCHAR>

FJsonSerializer::Deserialize 来加载json字符串。

### 7.4 文件读写与访问

PlatformFileManager.h

里面提供了很多的操作文件的接口。

### 7.5 GConfig

是简单的将ini文件做了封装。可以指定ini文件，Section名称，Key，值。

### 7.6 UE_LOG

能支持Category方式的日志输出，日志级别也能支持。

### 7.7 字符串处理

FName 无法修改的字符串，大小写不敏感。无论出现多少次，都是在字符串表里面只有一次出现。访问速度将会很快速。

FText 用于做显示的字符串，内置了本地化。

FString 能支持修改，消耗比上述的两种都要大。

### 7.8 编译器相关技巧

#### 7.8.1 废弃函数标记

编译器会检测出一些警告。

function Please update youre code to the new API before upgrading to the next release, otherwise your project will no longer compile.

#### 7.8.2 编译器指令实现跨平台

虚幻提供了FPlatformMisc，包含了大量平台相关的工具函数。

通过 typedef 切换编译期的平台切换。

在Linux里面有 FLinuxPlatformMisc 。切换的时候，将写这样的一句话。

typedef FLinuxPlatformMisc FPlatformMisc。

### 7.9 Images

ImagerWrapper 图片类型的抽象。

包含完整RGBA(red green blue alpha)数据的图片，是没有压缩过的，和格式没有关系，称为RawData原生的数据。

CompressedData会随着图片格式不同而不同。

ImagerWrapper是对这两个的封装。


# 第二部分 虚幻引擎浅析

## 第8章 模块机制

### 8.1 模块简介

C++项目对外提供库的时候，需要管理include,lib目录。Debug/Release模式下的lib文件的管理。而且还需要编译不同平台下的库文件。

在UE3的时候，使用MakeFile来模拟模块，UE4为了彻底解决这些问题，使用了Unreal Build Tool。

### 8.2 创建自己的模块

```bash
模块名.Build.cs
模块名.h
模块名.cpp
```

引入模块

工程名.Target.cs

SetupBinaries 方法里面调用 AddRange 函数将模块引入。

```cpp
OutExtraModuleNames.AddRange( new string[]{
  "pluginDev"
});
```

插件名.uplugin

文件里面写了关于插件相关的信息。文件格式是json。

### 8.3 虚幻引擎初始化模块加载顺序

本章就是列举了加载各种模块的顺序。


### 8.4 UBT/UHT

UBT=Unreal Build Tool

UBT工作分为三个阶段：

1. 收集阶段，将环境变量、UE源码目录，工程目录信息收集起来；
2. 参数解析阶段，将传入的命令行参数，确定自己生成的目标类型；
3. 实际生成阶段，根据环境、参数，开始生成makefile，确定C++的各种目录位置。开始构建项目。

UHT=Unreal Header Tool

UHT 配合实现了反射机制。

## 第9章 重要合行系统简介

### 9.1 内存分配

#### 9.1.1 Windows操作系统下的内存分配方案

主要通过

```cpp
FMalloc* FWindowsPlatformMemory::BaseAllocator()

#if ENABLE_WIN_ALLOC_TRACKING
#if FORCE_ANSI_ALLOCATOR
#elif WITH_EDITORONLY_DATA 
```

一共提供了Mallo（ANSI）、Intel TBB，以及Binned内存分配器。

### 9.2 引擎初始化过程

初始化过程一共两个

PreInit/Init

PreInit支持输出参数，CmdLine。

设置好工作目录，游戏目录。

初始化随机种子。

设置输出标准设备。

初始游戏主线程。

会调用LoadCoreModules。CoreModules。

之后会将PreInitModules会被加载起来，启动之后调用AppInit函数。

Init

所有模块都加载到内存中，如果有PostEngineInit函数，就会调用。过程由IProjectManager完成。

主循环

虚幻引擎，有一个EngineTick()。在主循环中最好不要调用繁重的任务，否则将会把游戏卡住。

### 9.3 并行与并发

测试代码一般文件名称为`模块名Test.cpp`。

```cpp
DEFINE_LOG_CATEGORY_STATIC(TestLog,Log,All);
IMPLEMENT_SIMPLE_AUTOMATION_TEST(FMultiThreadTest,"MyTest.PublicTest
  .MultiThreadIest", EAutomationTestFlags::EditorContext |
  EAutomationTestFlags::EngineFilter)
bool FMultiThreadTest::RunTest(const FString& Parameters)
```

通过UE4菜单栏。

Windows -> General -> Developer Tools -> Session Frontend

打开“会话窗口”。

点击"Start Tests"按钮，就可以在Message Output里面输出的日志。

可以通过`FRunnableThread::Create(new FRunnableTestThread(0)`创建线程。就能开启多个线程。

Task Graph系统

将“指令”和“数据”封成一个包，然后交给Task Graph，Task Graph找到空闲的线程，去处理Task。

虚幻引擎Rama，写过对于Task Graph的描述。

Task Graph采用模板匹配，无需每个Task继承于指定的类，只要类将一些函数实现，就能让模板编译通过。`TGraphTask::CreateTask`。

std::thread

可以直接使用c++11的多线程。

线程同步

灵界区`FCriticalSection`。

也提供了`std::future`，`std::promise`,`TFuture`, `TPromise`。

多进程

`Core.GenericPlatformProcess`可以看到`FGenericPlatformProcess`类的定义。可以通过管道进行数据交换。也将会返回`FProcHandle`子进程的句柄。

## 第10章 对象模型

本章主要讨论 UObject对象、组件对象和Actor对象。

### 10.1 UObject

创建：通过`NewObject<T>`产生。
销毁：通过引擎的垃圾回收来销毁。

创建过程分为两个步骤：

1. 通过分配器将内存分配出来；

使用`UObjectGlobals.GetPropertiesSize()`获取目标类的内存大小；

使用`FUObjectAllocator.AllocateUObject()`分配内存；

2. 使用这块内存调用new方法，构建对象出来；

使用`PlacemenetNew`将分配好的内存区域调用UObjectBase构造函数

对`UObject`提供UPackage存储读取逻辑。成员变量没有使用`UPROPERTY`宏标记，将不会序列化。

# 注册虚幻引擎阅读权限

可以登录到UE官网，开通github中，开源的UE源码阅读权限。

# 参考
- [1] [UnrealEngine4官方文档](https://docs.unrealengine.com/zh-CN/index.html)
- [2] [虚幻引擎官方-B站](https://space.bilibili.com/138827797?spm_id_from=333.788.b_765f7570696e666f.2)
- [3] [虚幻引擎-知乎](https://www.zhihu.com/org/xu-huan-yin-qing-24)
- [4] [虚幻引擎github](https://github.com/EpicGames/UnrealEngine)
- [5] [图片格式列举](https://blog.csdn.net/m0_38106923/article/details/101937827)