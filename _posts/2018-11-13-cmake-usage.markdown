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

- [文件名称](#%E6%96%87%E4%BB%B6%E5%90%8D%E7%A7%B0)
- [enable debug](#enable-debug)
- [use clang compiler](#use-clang-compiler)
- [include *h path](#include-h-path)
- [include lib path](#include-lib-path)
- [子目录](#%E5%AD%90%E7%9B%AE%E5%BD%95)
- [设置输出目录](#%E8%AE%BE%E7%BD%AE%E8%BE%93%E5%87%BA%E7%9B%AE%E5%BD%95)
- [拷贝文件夹，配置文件拷贝](#%E6%8B%B7%E8%B4%9D%E6%96%87%E4%BB%B6%E5%A4%B9%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E6%8B%B7%E8%B4%9D)
- [执行](#%E6%89%A7%E8%A1%8C)
- [cxx flag](#cxx-flag)
- [设置依赖关系](#%E8%AE%BE%E7%BD%AE%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB)
- [搜索文件列表](#%E6%90%9C%E7%B4%A2%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8)
- [设置使用了lib库](#%E8%AE%BE%E7%BD%AE%E4%BD%BF%E7%94%A8%E4%BA%86lib%E5%BA%93)
- [操作系统判断](#%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%88%A4%E6%96%AD)
- [Linux增加线程库](#linux%E5%A2%9E%E5%8A%A0%E7%BA%BF%E7%A8%8B%E5%BA%93)
- [使用环境变量](#%E4%BD%BF%E7%94%A8%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)
- [windows常用的编译选项](#windows%E5%B8%B8%E7%94%A8%E7%9A%84%E7%BC%96%E8%AF%91%E9%80%89%E9%A1%B9)


# 文件名称
```
CMakeLists.txt
```
# enable debug
```
cmake 
-DCMAKE_BUILD_TYPE=Debug
```
# use clang compiler
```
-DCMAKE_CXX_COMPILER=clang++ -DCMAKE_C_COMPILER=clang
```
# include *h path
```
include_directories(${CMAKE_CURRENT_LIST_DIR}/luabind/)
```
# include lib path
```
link_directories(${PROJECT_SOURCE_DIR}/external/lua/lib/)
```
# 子目录
```
add_subdirectory(GameServer)
```
# 设置输出目录
```
set(BUILD_TARGET_DIR ${PROJECT_SOURCE_DIR}/build/run/)
set(BUILD_LIB_DIR ${PROJECT_SOURCE_DIR}/build/lib/)
SET(EXECUTABLE_OUTPUT_PATH ${BUILD_TARGET_DIR}/server/)
```
# 拷贝文件夹，配置文件拷贝

```
file(COPY ${PROJECT_SOURCE_DIR}/tools/ DESTINATION  ${BUILD_TARGET_DIR} PATTERN .svn EXCLUDE)
configure_file(${PROJECT_SOURCE_DIR}/CenterServer/srcs/csstring.xml ${BUILD_TARGET_DIR}/ct/csstring.xml COPYONLY)
```
# 执行
```
execute_process(COMMAND  bash release.sh WORKING_DIRECTORY  ${PROJECT_SOURCE_DIR}/config_new/design/ )
```
# cxx flag
```
-Wall 开启全部warning
-Wextra  among other stuff
-fdiagnostics-color=auto 
-std=c++14 
-fsanitize=address 启用clang里面的内存检查
```
# 设置依赖关系
```
add_dependencies(server luabind)
```

# 搜索文件列表
```
file(GLOB_RECURSE GAME_SERVER src *.cpp *.h *.hpp *.xml )
file(GLOB variable [RELATIVE path] [globbing expressions]...)
file(GLOB_RECURSE variable [RELATIVE path]
[FOLLOW_SYMLINKS] [globbing expressions]...)
https://cmake.org/cmake/help/v3.0/command/file.html?highlight=file

add_executable(server ${GAME_SERVER})
```
# 设置使用了lib库
```
target_link_libraries(server crypt crypto rt z libprotobuf.a)
```

# 操作系统判断
```
IF (CMAKE_SYSTEM_NAME MATCHES "Windows")
   ...
ELSE ()
   ...
ENDIF (CMAKE_SYSTEM_NAME MATCHES "Windows")
```

# Linux增加线程库
```
find_package(Threads REQUIRED)
target_link_libraries(server Threads::Threads)
```
# 使用环境变量
```
include_directories( $ENV{path_libuv}/include )
```
# windows常用的编译选项
```
    add_definitions(-DWIN32)
    add_definitions(-DWIN32_LEAN_AND_MEAN)
    add_definitions(-D_WINSOCK_DEPRECATED_NO_WARNINGS)
    add_definitions(-D_CRT_SECURE_NO_WARNINGS)
target_link_libraries(client ws2_32.lib)
```
