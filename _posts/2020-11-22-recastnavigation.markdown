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

# 1.recastnavigation工程

RecastNavigation 是一个的导航寻路工具集，它包括了几个子集：

```doc
Recast：负责根据提供的模型生成导航网格。
Detour：利用导航网格做寻路操作。这里的导航网格可以是 Recast 生成的，也可以是其他工具生成的。
DetourCrowd：提供了群体寻路行为的功能。
Recast Demo：一个很完善的 Demo，基本上将 Recast 、 Detour 提供的功能都很好地展现了出来。弄懂了这个 Demo 的功能，基本也就了解了 RecastNavigation 究竟可以干什么事。
```

Recast先从几何体构造素模，然后在其上投射导航网格。此过程包括三个步骤：

1. 创建素模(voxel mold)；

通过将三角形栅格化为多层高度场，从输入三角形网格构建体素模具。然后将一些简单的滤镜应用到模具上，以修剪角色无法移动的位置。

2. 将素模划分成简单区域(region)；

模具描述的可行走区域分为简单的2D覆盖区域。 生成的区域仅具有不重叠的轮廓，这大大简化了过程的最后一步。

3. 将区域转换成多边形(polygons)；

通过首先跟踪边界，然后对其进行简化，可以将导航多边形从区域中剥离。 最终将生成的多边形转换为凸多边形，这使它们非常适合该级的寻路和空间推理。

> 注：凸多边形的内角均小于或等于180°，边数为n（n属于Z且n大于2）的凸多边形内角和为（n－2）×180°，但任意凸多边形外角和均为360°，并可通过反证法证明凸多边形内角中锐角的个数不能多于3个。

尝试将unreal engine 里面的地图导出成detour能使用的导航网格：

再 UNREAL ENGINE 里面地图是*.umap文件。我们用UE打开之后，在菜单栏里面操作： Windows->导出NavMesh。这个步骤将会生成一个*.obj文件。这种文件其实是一种文本文件，描述了3D对象模型信息。Unity3D也一样能导出这样的文件。

我们编写了一个程序 RecastCreator。这个程序能将*.obj文件导出成为一个binary文件。后续就直接使用binary文件来做导航操作。


```bat
PS D:\work\trunk\refer\recastnavigation\RecastDemo\Bin\Meshes> .\RecastCreator.exe -cfg -out t3.obj t3.region
----- Create Cfg -----
cellsize = 0.30
cellheight = 0.20
agentheight = 2
agentradius = 0.6
agentmaxclimb = 0.9
agentmaxslope = 45
regionminsize = 8
regionmergesize = 20
edgemaxlen = 12
edgemaxerror = 1.3
vertsperpoly = 6
detailsampledist = 6
detailsamplemaxerror = 1
partitiontype = 1
tilesize = 0
----- End -----
PS D:\work\trunk\refer\recastnavigation\RecastDemo\Bin\Meshes> .\RecastCreator.exe -out t3.obj t3.region
----- Create Bin -----
Building navigation:
 - 1028 x 1135 cells
 - 525.2K verts, 306.2K tris
Build Times
- Rasterize:    176.99ms        (24.5%)
- Build Compact:        39.54ms (5.5%)
- Filter Border:        29.55ms (4.1%)
- Filter Walkable:      5.15ms  (0.7%)
- Erode Area:   19.18ms (2.7%)
- Median Area:  0.00ms  (0.0%)
- Mark Box Area:        0.00ms  (0.0%)
- Mark Convex Area:     0.00ms  (0.0%)
- Mark Cylinder Area:   0.00ms  (0.0%)
- Build Distance Field: 29.01ms (4.0%)
    - Distance: 19.88ms (2.7%)
    - Blur:     8.95ms  (1.2%)
- Build Regions:        105.62ms        (14.6%)
    - Watershed:        97.48ms (13.5%)
      - Expand: 35.47ms (4.9%)
      - Find Basins:    2.93ms  (0.4%)
    - Filter:   6.76ms  (0.9%)
- Build Layers: 0.00ms  (0.0%)
- Build Contours:       13.14ms (1.8%)
    - Trace:    8.87ms  (1.2%)
    - Simplify: 2.00ms  (0.3%)
- Build Polymesh:       6.09ms  (0.8%)
- Build Polymesh Detail:        286.67ms        (39.6%)
- Merge Polymeshes:     0.00ms  (0.0%)
- Merge Polymesh Details:       0.00ms  (0.0%)
=== TOTAL:      723.73ms
>> Polymesh: 2552 vertices  1153 polygons

----- End -----
```

# 2.环境搭建

## 2.1.编译recastnavigation

| 工具名称         | 版本信息   |
| :--------------- | :--------- |
| visualstudio2019 | 16.8.3     |
| CMake            | 3.19.0-rc1 |
| premake          | 5.0        |

### 2.1.1.下载地址

| 名称    | 下载地址                                                                                                           |
| :------ | :----------------------------------------------------------------------------------------------------------------- |
| SDL     | [https://www.libsdl.org/release/SDL2-devel-2.0.14-VC.zip](https://www.libsdl.org/release/SDL2-devel-2.0.14-VC.zip) |
| premake | [https://premake.github.io/](https://premake.github.io/)                                                           |

### 2.1.2.准备好SDL2的dll

将下载的SDL2.dll文件放入到子目录中：

```
recastnavigation\RecastDemo\Contrib\SDL\lib\x84\SDL2.dll
```

使用CMake将SDL2编译出来。在windows里面，我这里都是使用32位编译的。

### 2.1.3.使用premake5生成工程文件

这个默认生成的是win32位的

```bat
D:\work\trunk\refer\recastnavigation\RecastDemo>"premake5" vs2019
Building configurations...
Running action 'vs2019'...
Generated Build/vs2019/recastnavigation.sln...
Generated Build/vs2019/DebugUtils.vcxproj...
Generated Build/vs2019/DebugUtils.vcxproj.filters...
Generated Build/vs2019/Detour.vcxproj...
Generated Build/vs2019/Detour.vcxproj.filters...
Generated Build/vs2019/DetourCrowd.vcxproj...
Generated Build/vs2019/DetourCrowd.vcxproj.filters...
Generated Build/vs2019/DetourTileCache.vcxproj...
Generated Build/vs2019/DetourTileCache.vcxproj.filters...
Generated Build/vs2019/Recast.vcxproj...
Generated Build/vs2019/Recast.vcxproj.filters...
Generated Build/vs2019/RecastDemo.vcxproj...
Generated Build/vs2019/RecastDemo.vcxproj.user...
Generated Build/vs2019/RecastDemo.vcxproj.filters...
Generated Build/vs2019/Tests.vcxproj...
Generated Build/vs2019/Tests.vcxproj.user...
Generated Build/vs2019/Tests.vcxproj.filters...
Done (225ms).
```

工程属性->生成事件->命令行；将这个去掉吧
```
1>找不到文件 - SDL2.dll
1>C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Microsoft\VC\v160\Microsoft.CppCommon.targets(153,5): error MSB3073: 命令“IF EXIST "..\..\Contrib\SDL\lib\x86\SDL2.dll"\ (xcopy /Q /E /Y /I "..\..\Contrib\SDL\lib\x86\SDL2.dll" "..\..\Bin" > nul) ELSE (xcopy /Q /Y /I "..\..\Contrib\SDL\lib\x86\SDL2.dll" "..\..\Bin" > nul)
1>C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Microsoft\VC\v160\Microsoft.CppCommon.targets(153,5): error MSB3073: :VCEnd”已退出，代码为 4。
1>已完成生成项目“RecastDemo.vcxproj”的操作 - 失败。

IF EXIST "..\..\Contrib\SDL\lib\x86\SDL2.dll"\ (xcopy /Q /E /Y /I "..\..\Contrib\SDL\lib\x86\SDL2.dll" "..\..\Bin" > nul) ELSE (xcopy /Q /Y /I "..\..\Contrib\SDL\lib\x86\SDL2.dll" "..\..\Bin" > nul)
```

自己手动将编译出来的文件复制过去。

RecastDemo的效果图：

[![rr16JS.png](https://s3.ax1x.com/2020/12/22/rr16JS.png)](https://imgchr.com/i/rr16JS)

加载一个obj文件：

[![rrHrJs.png](https://s3.ax1x.com/2020/12/22/rrHrJs.png)](https://imgchr.com/i/rrHrJs)

将obj文件的导航网格生成出来：

生成了之后，地图的颜色将会变化，只需要点击"Build"。有导航网格，才能去测试导航功能。

[![rrHsWn.png](https://s3.ax1x.com/2020/12/22/rrHsWn.png)](https://imgchr.com/i/rrHsWn)

测试导航功能：

在地图上选择开始结束点；"shift+鼠标左键"

[![rrHcQ0.png](https://s3.ax1x.com/2020/12/22/rrHcQ0.png)](https://imgchr.com/i/rrHcQ0)

# 3.Recast 导航网格类型

recastnavigation中提供了3种模式的导航网格：

## 3.1.SoloMesh

其中SoloMesh模式是静态的导航网格，即对场景build一次之后，将导航网格缓存起来供寻路使用，后续不再允许场景的地形发生变化

文件头：

```cpp
static const int NAVMESHSET_MAGIC = 'M'<<24 | 'S'<<16 | 'E'<<8 | 'T'; //'MSET';
struct NavMeshSetHeader
{
	uint32_t magic;
	uint32_t version;
	uint32_t numTiles;
	dtNavMeshParams params;
};
	// Store header.
	NavMeshSetHeader header;
	header.magic = NAVMESHSET_MAGIC;
	header.version = NAVMESHSET_VERSION;
	header.numTiles = 0;

```

## 3.2.TileMesh

TileMesh也是静态的导航网格，只是与SoloMesh相比它按tile来处理地图，算是介于SoloMesh和TempObstacles之间的一种模式

```cpp
// 文件名：all_tiles_navmesh.bin
// 文件头： TESM
static const int NAVMESHSET_MAGIC = 'M'<<24 | 'S'<<16 | 'E'<<8 | 'T'; //'MSET';

// 加载文件失败：
dtStatus addTileStatus = m_tileCache->addTile(data, tileHeader.dataSize, DT_COMPRESSEDTILE_FREE_DATA, &tile);
inline bool dtStatusFailed(dtStatus status)
static const unsigned int DT_FAILURE = 1u << 31;			// Operation failed.
static const unsigned int DT_WRONG_MAGIC = 1 << 0;		// Input data is not recognized.
	if (header->magic != DT_TILECACHE_MAGIC)
		return DT_FAILURE | DT_WRONG_MAGIC;

static const int DT_TILECACHE_MAGIC = 'D'<<24 | 'T'<<16 | 'L'<<8 | 'R'; ///< 'DTLR';


Sample::saveAll("all_tiles_navmesh.bin", m_navMesh);


```

## 3.3.TempObstacles

TempObstacles模式可以支持向场景中动态添加或移除预设形状的阻挡物，导航网格也会随之更新（不过只支持添加阻挡物，而不支持添加新的可行走区域）在处理动态阻挡时，由于单个阻挡对地图的影响区域是有限的，所以会采用将地图切割成多个固定大小的tile，以tile为单位进行网格的生成。这样在添加或移除阻挡时，只需要处理与阻挡相交的tile，而不需要处理整个地图

```cpp
static const int TILECACHESET_MAGIC = 'T' << 24 | 'S' << 16 | 'E' << 8 | 'T'; //'TSET';
```

[参考NavMeshDemo源码](https://github.com/ZLSYMDJ/NavMeshDemo)

## 3.4.导出Mesh的源码分析

参考官方的代码-RecastDemo部分，在右边的上部，"Sample"中下拉菜单中选择的三类(Solo Mesh、Tile Mesh、Temp Obstacles)导出方式都看明白。

3种导出方式：

```cpp
Sample* createSolo() { return new Sample_SoloMesh(); }
Sample* createTile() { return new Sample_TileMesh(); }
Sample* createTempObstacle() { return new Sample_TempObstacles(); }
```

"Build"按钮将会调用

```cpp
				if (imguiButton("Build"))
				{
					ctx.resetLog();
					if (!sample->handleBuild())
					{
						showLog = true;
						logScroll = 0;
					}
					ctx.dumpLog("Build log %s:", meshName.c_str());
					
					// Clear test.
					delete test;
					test = 0;
				}
```

"Save"按钮将会把生成的网格存储到

| 类型         | 文件                    | 大小  |
| :----------- | :---------------------- | :---- |
| Solo         | solo_navmesh.bin        | 240kb |
| Tile         | all_tiles_navmesh.bin   | 479kb |
| TempObstacle | all_tiles_tilecache.bin | 479kb |

导出时候需要设置的参数：

| 变量                 | 基本信息                                                                            | 备注 |
| :------------------- | :---------------------------------------------------------------------------------- | :--- |
| cellsize             | 方块尺寸                                                                            | 0.3  |
| cellheight           | 方块高度                                                                            | 0.2  |
| agentheight          | walkableHeight = agentheight/ cellheight                                            | 2    |
| agentradius          | walkableClimb = agentradius/ cellheight                                             | 0.6  |
| agentmaxclimb        | walkableRadius = agentmaxclimb/ cellheight                                          | 0.9  |
| agentmaxslope        | walkableSlopeAngle = agentmaxslope                                                  | 45   |
| regionminsize        | minRegionArea = regionminsize*regionminsize                                         | 8    |
| regionmergesize      | mergeRegionArea = regionmergesize*regionmergesize                                   | 20   |
| edgemaxlen           | maxEdgeLen = edgemaxlen/cellheight                                                  | 12   |
| edgemaxerror         | maxSimplificationError = edgemaxerror                                               | 1.3  |
| vertsperpoly         | maxVertsPerPoly                                                                     | 6    |
| detailsampledist     | detailSampleDist = detailsampledist < 0.9f ? 0 : cellsize * detailsampledist; | 6    |
| detailsamplemaxerror | detailSampleMaxError = cellheight * detailsamplemaxerror                        | 1    |
| partitiontype        |                                                                                     | 1    |
| tilesize             |                                                                                     | 48   |

[RecastNavigation-rcConfig文档](http://www.stevefsp.org/projects/rcndoc/prod/structrcConfig.html)

cellsize

方块尺寸（x,z平面上），和平面有关系。较低的值将产生较高质量的导航，但是图形扫描较慢。在文档里面记作 [vx]

[![ymUU0I.gif](https://s3.ax1x.com/2021/02/02/ymUU0I.gif)](https://imgchr.com/i/ymUU0I)

cellheight

方块高度（y高程），和爬坡有关系。记录计算攀爬仰角，攀爬的高度，计算边缘都需要这个。官方文档里面记作 [vy]

agentheight

---

minRegionArea

最小孤岛所容纳的cell数目；

任意区域小于指定的数目，将会标记成无法行走。这个东西通常用于去删除无用几何体，比如桌子的顶部，盒子的顶部等等。

值域：[Limit: >=0] 作用域：[Units: vx]，vx代表平面；

[![ymUNnA.gif](https://s3.ax1x.com/2021/02/02/ymUNnA.gif)](https://imgchr.com/i/ymUNnA)

mergeRegionArea

如果有可能性的话，任意区域如果cell的数目小于它，将会被融合到比它大的区域里面。

值域：[Limit: >=0] 作用域：[Units: vx]

edgemaxlen

沿网格边界的轮廓边缘的最大允许长度。 [Limit: >=0] [Units: vx].

这个将会让边缘更加趋于直线。如果想关闭这个功能将值设置成0。

[![ymUz9O.gif](https://s3.ax1x.com/2021/02/02/ymUz9O.gif)](https://imgchr.com/i/ymUz9O)

partitiontype

分区方式

Watershed 分水岭方式

enum SamplePartitionType SAMPLE_PARTITION_WATERSHED = 0

Monotone 单调方式

enum SamplePartitionType SAMPLE_PARTITION_MONOTONE = 1

Layers 分层方式

enum SamplePartitionType SAMPLE_PARTITION_LAYERS = 2

原文释义：

```doc
 Partition the heightfield so that we can use simple algorithm later to triangulate the walkable areas.
 There are 3 martitioning methods, each with some pros and cons:
 1) Watershed partitioning
   - the classic Recast partitioning
   - creates the nicest tessellation
   - usually slowest
   - partitions the heightfield into nice regions without holes or overlaps
   - the are some corner cases where this method creates produces holes and overlaps
      - holes may appear when a small obstacles is close to large open area (triangulation can handle this)
      - overlaps may occur if you have narrow spiral corridors (i.e stairs), this make triangulation to fail
   * generally the best choice if you precompute the nacmesh, use this if you have large open areas
 2) Monotone partioning
   - fastest
   - partitions the heightfield into regions without holes and overlaps (guaranteed)
   - creates long thin polygons, which sometimes causes paths with detours
   * use this if you want fast navmesh generation
 3) Layer partitoining
   - quite fast
   - partitions the heighfield into non-overlapping regions
   - relies on the triangulation code to cope with holes (thus slower than monotone partitioning)
   - produces better triangles than monotone partitioning
   - does not have the corner cases of watershed partitioning
   - can be slow and create a bit ugly tessellation (still better than monotone)
     if you have large open areas with small obstacles (not a problem if you use tiles)
   * good choice to use for tiled navmesh with medium and small sized tiles
```

tilesize

每块tile再xz平面上的size。[Limit: >= 0] [Units: vx].

这个值旨在编译出多tile mesh的时候生效（temp obstacles/tiles）。

# 4.包围盒分类

## 4.1.AABB

AABB算法的全称是 - axis aligned bounding box (轴对齐-边界盒)AABB 包围盒是与坐标轴对齐的包围盒, 简单性好, 紧密性较差。

## 4.2.OBB

OBB 包围盒: OBB（oriented bounding box 方向矩形边界框） 碰撞检測方法紧密性是较好的, 可以大大降低參与相交測试的包围盒的数目, 因此整体性能要优于AABB 和包围球, 而且实时性程度较高。

# 参考

- [1] [recastnavigation](https://github.com/recastnavigation/recastnavigation)
- [2] [premake](https://premake.github.io/download.html#v5)
- [3] [SDL](https://www.libsdl.org/download-2.0.php)
- [4] [recastdetour手册](http://masagroup.github.io/recastdetour/index.html)
- [5] [游戏的寻路导航 1：导航网格](https://zhuanlan.zhihu.com/p/35100455)
- [6] [recastNavigation读书笔记1](https://blog.csdn.net/weixin_34132768/article/details/93762363)
- [7] [CritterAI](http://critterai.org/projects/nmgen_study/overview.html)
- [8] [B站讲解RecastDemo如何使用](https://www.bilibili.com/video/BV1uK4y1E7CV?from=search&seid=8637375892047322871)
- [9] [从零开始学习导航网格](https://www.jianshu.com/p/64469a410b5d)
- [10] [AABB&OBB包围盒](https://www.cnblogs.com/mfrbuaa/p/4073880.html)
- [11] [生成寻路网格的配置](https://blog.csdn.net/Kathy_unity/article/details/81583968)
- [12] [手动创建navmesh](https://arongranberg.com/astar/docs/createnavmesh.html)
- [13] [navmesh参数](https://arongranberg.com/astar/docs/recastgraph.html)
- [14] [ue-navmesh](https://imzlp.com/posts/20203/)