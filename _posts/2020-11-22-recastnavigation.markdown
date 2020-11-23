---
layout: post
title: "recastnavigation"
subtitle: 'recastnavigation熟悉'
author: "Abel"
header-style: text
tags:
  - recastnavigation
  - game
---

recastnavigation 在做3d游戏的时候，用于做导航的。当前使用 unreal 4.25

# recastnavigation工程

RecastNavigation 是一个的导航寻路工具集，它包括了几个子集：

```doc
Recast：负责根据提供的模型生成导航网格。
Detour：利用导航网格做寻路操作。这里的导航网格可以是 Recast 生成的，也可以是其他工具生成的。
DetourCrowd：提供了群体寻路行为的功能。
Recast Demo：一个很完善的 Demo，基本上将 Recast 、 Detour 提供的功能都很好地展现了出来。弄懂了这个 Demo 的功能，基本也就了解了 RecastNavigation 究竟可以干什么事。
```



# 参考
- [1] [recastnavigation](https://github.com/recastnavigation/recastnavigation)
- [2] [premake](https://premake.github.io/download.html#v5)
- [3] [SDL](https://www.libsdl.org/download-2.0.php)
- [4] [recastdetour手册](http://masagroup.github.io/recastdetour/index.html)
- [5] [游戏的寻路导航 1：导航网格](https://zhuanlan.zhihu.com/p/35100455)
