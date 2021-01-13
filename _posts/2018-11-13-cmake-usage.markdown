---
layout: post
title: "cmake入门"
subtitle: 'cmake一些常用的实例'
author: "Abel"
header-style: text
tags:
  - cmake
  - c++ 
  - builder
---

记录cmake常用方法

- [基本操作](#基本操作)
- [设置编译环境](#设置编译环境)
- [参数设置](#参数设置)

# 基本操作

文件名称

```
CMakeLists.txt
```

开启调试模式

```
cmake 
-DCMAKE_BUILD_TYPE=Debug
```

use clang compiler

```
-DCMAKE_CXX_COMPILER=clang++ -DCMAKE_C_COMPILER=clang
```

包含子目录

```
add_subdirectory(GameServer)
```

# 设置编译环境

include *h path

```
include_directories(${CMAKE_CURRENT_LIST_DIR}/luabind/)
```

include lib path

```
link_directories(${PROJECT_SOURCE_DIR}/external/lua/lib/)
```

设置输出目录

```
set(BUILD_TARGET_DIR ${PROJECT_SOURCE_DIR}/build/run/)
set(BUILD_LIB_DIR ${PROJECT_SOURCE_DIR}/build/lib/)
SET(EXECUTABLE_OUTPUT_PATH ${BUILD_TARGET_DIR}/server/)
```
拷贝文件夹，配置文件拷贝

```
file(COPY ${PROJECT_SOURCE_DIR}/tools/ DESTINATION  ${BUILD_TARGET_DIR} PATTERN .svn EXCLUDE)
configure_file(${PROJECT_SOURCE_DIR}/CenterServer/srcs/csstring.xml ${BUILD_TARGET_DIR}/ct/csstring.xml COPYONLY)
```

使用环境变量

```
include_directories( $ENV{path_libuv}/include )
```

执行

```
execute_process(COMMAND  bash release.sh WORKING_DIRECTORY  ${PROJECT_SOURCE_DIR}/config_new/design/ )
```

# 参数设置
cxx flag

```
-Wall 开启全部warning
-Wextra  among other stuff
-fdiagnostics-color=auto 
-std=c++14 
-fsanitize=address 启用clang里面的内存检查
```

设置依赖关系
```
add_dependencies(server luabind)
```

搜索文件列表

```
file(GLOB_RECURSE GAME_SERVER src *.cpp *.h *.hpp *.xml )
file(GLOB variable [RELATIVE path] [globbing expressions]...)
file(GLOB_RECURSE variable [RELATIVE path]
[FOLLOW_SYMLINKS] [globbing expressions]...)
https://cmake.org/cmake/help/v3.0/command/file.html?highlight=file

add_executable(server ${GAME_SERVER})
```

设置使用了lib库

```
target_link_libraries(server crypt crypto rt z libprotobuf.a)
```

操作系统判断

```
IF (CMAKE_SYSTEM_NAME MATCHES "Windows")
   ...
ELSE ()
   ...
ENDIF (CMAKE_SYSTEM_NAME MATCHES "Windows")
```

windows常用的编译选项

```
    add_definitions(-DWIN32)
    add_definitions(-DWIN32_LEAN_AND_MEAN)
    add_definitions(-D_WINSOCK_DEPRECATED_NO_WARNINGS)
    add_definitions(-D_CRT_SECURE_NO_WARNINGS)
target_link_libraries(client ws2_32.lib)
```
