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

CMake是为了解决美国国家医学图书馆出资的Visible Human Project专案下的Insight Segmentation and Registration Toolkit （ITK） 软件的跨平台建构的需求而创造出来的，其设计受到了Ken Martin开发的pcmaker所影响。pcmaker当初则是为了支援Visualization Toolkit这个开放源代码的三维图形和视觉系统才出现的，今日VTK也采用了CMake。在设计CMake之时，Kitware公司的Bill Hoffman采用了pcmaker的一些重要想法，加上更多他自己的点子，想把GNU建构系统的一些功能整合进来。CMake最初的实作是在2000年中作的，在2001年初有了急速的进展，许多改良是来自其他把CMake整合到自己的系统中的开发者，比方说，采用CMake作为建构环境的VXL社群就贡献了很多重要的功能，Brad King为了支援CABLE和GCC-XML这套自动包装工具也加了几项功能，奇异公司的研发部门则用在内部的测试系统DART，还有一些功能是为了让VTK可以过渡到CMake和支援（“美国Los Alamos国家实验室”&“洛斯阿拉莫斯国家实验室”）的Advanced Computing Lab的平行视觉系统ParaView而加的。

# 官网的教程

[传送门](https://cmake.org/cmake-tutorial/)

本章节将会按照官方网站里面提到的步骤来学习cmake的基本用法。

## 编译一个exe

CMakeLists.txt

```bash
cmake_minimum_required (VERSION 2.6)
project (Tutorial)
add_executable(Tutorial tutorial.cxx)
```

tutorial.cpp

```cpp
// tutorial.cpp
#include <stdio.h>
int main (int argc, char *argv[])
{
  //...
  printf("hello");
  return 0;
}
```

## 使用版本号定义

```bash
cmake_minimum_required (VERSION 2.6)
project (Tutorial)
# The version number.
set (Tutorial_VERSION_MAJOR 1)
set (Tutorial_VERSION_MINOR 0)
 
# configure a header file to pass some of the CMake settings
# to the source code
configure_file (
  "${PROJECT_SOURCE_DIR}/TutorialConfig.h.in"
  "${PROJECT_BINARY_DIR}/TutorialConfig.h"
  )
 
# add the binary tree to the search path for include files
# so that we will find TutorialConfig.h
include_directories("${PROJECT_BINARY_DIR}")
 
# add the executable
add_executable(Tutorial tutorial.cxx)
```

TutorialConfig.h.in文件中编写这个内容

```h
// the configured options and settings for Tutorial
#define Tutorial_VERSION_MAJOR @Tutorial_VERSION_MAJOR@
#define Tutorial_VERSION_MINOR @Tutorial_VERSION_MINOR@
```

最后将会生成代码TutorialConfig.h

在源码里面我们能很方便的使用

```cpp
#include "TutorialConfig.h"
    fprintf(stdout,"%s Version %d.%d\n",
            argv[0],
            Tutorial_VERSION_MAJOR,
            Tutorial_VERSION_MINOR);
```

## 使用自己的lib库

```bash
# should we use our own math functions?
option (USE_MYMATH 
        "Use tutorial provided math implementation" ON) 
add_library(MathFunctions mysqrt.cxx)
include_directories ("${PROJECT_SOURCE_DIR}/MathFunctions")
add_subdirectory (MathFunctions) 
 
# add the executable
add_executable (Tutorial tutorial.cxx)
target_link_libraries (Tutorial MathFunctions)

# add the MathFunctions library?
#
if (USE_MYMATH)
  include_directories ("${PROJECT_SOURCE_DIR}/MathFunctions")
  add_subdirectory (MathFunctions)
  set (EXTRA_LIBS ${EXTRA_LIBS} MathFunctions)
endif (USE_MYMATH)
 
# add the executable
add_executable (Tutorial tutorial.cxx)
target_link_libraries (Tutorial  ${EXTRA_LIBS})
```

在代码里面可以使用刚刚的宏开关

```cpp
#ifdef USE_MYMATH
#include "MathFunctions.h"
#endif

#ifdef USE_MYMATH
  double outputValue = mysqrt(inputValue);
#else
  double outputValue = sqrt(inputValue);
#endif
```


## 安装与测试

将安装的文件拷贝到指定的目录中。

```bash
install (TARGETS MathFunctions DESTINATION bin)
install (FILES MathFunctions.h DESTINATION include)

# add the install targets
install (TARGETS Tutorial DESTINATION bin)
install (FILES "${PROJECT_BINARY_DIR}/TutorialConfig.h"        
         DESTINATION include)
```

先引入这个模块

```bash
include(CTest)
```

通过编写的宏来检查当前的测试是否能通过。

```cpp
#define a macro to simplify adding tests, then use it
macro (do_test arg result)
  add_test (TutorialComp${arg} Tutorial ${arg})
  set_tests_properties (TutorialComp${arg}
    PROPERTIES PASS_REGULAR_EXPRESSION ${result})
endmacro (do_test)
 
# do a bunch of result based tests
do_test (25 "25 is 5")
do_test (-25 "-25 is 0")
```

## 平台检查

添加检查

```bash
# does this system provide the log and exp functions?
include (CheckFunctionExists)
check_function_exists (log HAVE_LOG)
check_function_exists (exp HAVE_EXP)
```

通过这个来检查当前平台是否存在log,exp函数，如果有将直接在代码里面使用系统的支持函数。

console

```cpp
// does the platform provide exp and log functions?
#cmakedefine HAVE_LOG
#cmakedefine HAVE_EXP
```

代码

```cpp
// if we have both log and exp then use them
#if defined (HAVE_LOG) && defined (HAVE_EXP)
  result = exp(log(x)*0.5);
#else // otherwise use an iterative approach
  . . .

```

## 自定义选项

用于制作条件打开某个功能。

```bash
# 设置一个OctSvr的开关，默认设置为OFF
option (OctSvr "OctSvr" OFF)
if (OctSvr)
      # 做一些开关内的事情。
endif (OctSvr)
# 在命令行中手动的打开或这关闭
cmake -DOctSvr=[ON|OFF(default)] 
```

## 开启c++ 17

```bash
// windows
    add_compile_options("/std:c++17")	
// linux
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17 ")
```

## 目录文件批量添加

```bash
file(GLOB pbc_SRC "3rd/pbc/src/*.h" "3rd/pbc/src/*.c" )
```

## 设置cmake工程依赖关系

```bash
add_subdirectory(common)
add_subdirectory(chuanqi_robot)
add_dependencies(chuanqi_robot common)
```

## 执行程序

## 添加一个生成文件和生成器

这个实例是编写了一个table生成的execute文件，生成一个开方的文件出来。然后通过cmake集成到编译过程中。
MakeTable.cxx文件中实现了一个可以生成table的一个程序

```cpp
// A simple program that builds a sqrt table 
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
 
int main (int argc, char *argv[])
{
  int i;
  double result;
 
  // make sure we have enough arguments
  if (argc < 2)
    {
    return 1;
    }
  
  // open the output file
  FILE *fout = fopen(argv[1],"w");
  if (!fout)
    {
    return 1;
    }
  
  // create a source file with a table of square roots
  fprintf(fout,"double sqrtTable[] = {\n");
  for (i = 0; i < 10; ++i)
    {
    result = sqrt(static_cast<double>(i));
    fprintf(fout,"%g,\n",result);
    }
 
  // close the table with a zero
  fprintf(fout,"0};\n");
  fclose(fout);
  return 0;
}

```

这里的cmakefile.txt文件中说明要如何生成这个MakeTable，之后添加了一个add_custom_command的命令，用于将一个table.h生成出来。
通过include_directories将本地目录加入到include搜索目录，并且在编译MathFunctions这个library库的时候，添加上Table.h的依赖。

```bash
# first we add the executable that generates the table
add_executable(MakeTable MakeTable.cxx)
 
# add the command to generate the source code
add_custom_command (
  OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/Table.h
  COMMAND MakeTable ${CMAKE_CURRENT_BINARY_DIR}/Table.h
  DEPENDS MakeTable
  )
 
# add the binary tree directory to the search path for 
# include files
include_directories( ${CMAKE_CURRENT_BINARY_DIR} )
 
# add the main library
add_library(MathFunctions mysqrt.cxx ${CMAKE_CURRENT_BINARY_DIR}/Table.h  )
```

## 现在完整的cmake

```bash
# CMakeLists.txt
cmake_minimum_required (VERSION 2.6)
project (Tutorial)
include(CTest)
 
# The version number.
set (Tutorial_VERSION_MAJOR 1)
set (Tutorial_VERSION_MINOR 0)
 
# does this system provide the log and exp functions?
include (${CMAKE_ROOT}/Modules/CheckFunctionExists.cmake)
 
check_function_exists (log HAVE_LOG)
check_function_exists (exp HAVE_EXP)
 
# should we use our own math functions
option(USE_MYMATH 
  "Use tutorial provided math implementation" ON)
 
# configure a header file to pass some of the CMake settings
# to the source code
configure_file (
  "${PROJECT_SOURCE_DIR}/TutorialConfig.h.in"
  "${PROJECT_BINARY_DIR}/TutorialConfig.h"
  )
 
# add the binary tree to the search path for include files
# so that we will find TutorialConfig.h
include_directories ("${PROJECT_BINARY_DIR}")
 
# add the MathFunctions library?
if (USE_MYMATH)
  include_directories ("${PROJECT_SOURCE_DIR}/MathFunctions")
  add_subdirectory (MathFunctions)
  set (EXTRA_LIBS ${EXTRA_LIBS} MathFunctions)
endif (USE_MYMATH)
 
# add the executable
add_executable (Tutorial tutorial.cxx)
target_link_libraries (Tutorial  ${EXTRA_LIBS})
 
# add the install targets
install (TARGETS Tutorial DESTINATION bin)
install (FILES "${PROJECT_BINARY_DIR}/TutorialConfig.h"        
         DESTINATION include)
 
# does the application run
add_test (TutorialRuns Tutorial 25)
 
# does the usage message work?
add_test (TutorialUsage Tutorial)
set_tests_properties (TutorialUsage
  PROPERTIES 
  PASS_REGULAR_EXPRESSION "Usage:.*number"
  )
 
 
#define a macro to simplify adding tests
macro (do_test arg result)
  add_test (TutorialComp${arg} Tutorial ${arg})
  set_tests_properties (TutorialComp${arg}
    PROPERTIES PASS_REGULAR_EXPRESSION ${result}
    )
endmacro (do_test)
 
# do a bunch of result based tests
do_test (4 "4 is 2")
do_test (9 "9 is 3")
do_test (5 "5 is 2.236")
do_test (7 "7 is 2.645")
do_test (25 "25 is 5")
do_test (-25 "-25 is 0")
do_test (0.0001 "0.0001 is 0.01")

```

btw: 今天发现在mac机器上dll文件换了个后缀，叫做*.dylib文件。^_^

# 基本操作

文件名称

```bash
CMakeLists.txt
```

开启调试模式

```bash
cmake 
-DCMAKE_BUILD_TYPE=Debug
```

use clang compiler

```bash
-DCMAKE_CXX_COMPILER=clang++ -DCMAKE_C_COMPILER=clang
```

包含子目录

```bash
add_subdirectory(GameServer)
```

# 设置编译环境

include *h path

```bash
include_directories(${CMAKE_CURRENT_LIST_DIR}/luabind/)
```

include lib path

```bash
link_directories(${PROJECT_SOURCE_DIR}/external/lua/lib/)
```

设置输出目录

```bash
set(BUILD_TARGET_DIR ${PROJECT_SOURCE_DIR}/build/run/)
set(BUILD_LIB_DIR ${PROJECT_SOURCE_DIR}/build/lib/)
SET(EXECUTABLE_OUTPUT_PATH ${BUILD_TARGET_DIR}/server/)
```

拷贝文件夹，配置文件拷贝

```bash
file(COPY ${PROJECT_SOURCE_DIR}/tools/ DESTINATION  ${BUILD_TARGET_DIR} PATTERN .svn EXCLUDE)
configure_file(${PROJECT_SOURCE_DIR}/CenterServer/srcs/csstring.xml ${BUILD_TARGET_DIR}/ct/csstring.xml COPYONLY)
```

使用环境变量

```bash
include_directories( $ENV{path_libuv}/include )
```

执行

```bash
execute_process(COMMAND  bash release.sh WORKING_DIRECTORY  ${PROJECT_SOURCE_DIR}/config_new/design/ )
```

# 参数设置

cxx flag

```bash
-Wall 开启全部warning
-Wextra  among other stuff
-fdiagnostics-color=auto 
-std=c++14 
-fsanitize=address 启用clang里面的内存检查
```

设置依赖关系

```bash
add_dependencies(server luabind)
```

搜索文件列表

```bash
file(GLOB_RECURSE GAME_SERVER src *.cpp *.h *.hpp *.xml )
file(GLOB variable [RELATIVE path] [globbing expressions]...)
file(GLOB_RECURSE variable [RELATIVE path]
[FOLLOW_SYMLINKS] [globbing expressions]...)
https://cmake.org/cmake/help/v3.0/command/file.html?highlight=file

add_executable(server ${GAME_SERVER})
```

设置使用了lib库

```bash
target_link_libraries(server crypt crypto rt z libprotobuf.a)
```

操作系统判断

```bash
IF (CMAKE_SYSTEM_NAME MATCHES "Windows")
   ...
ELSE ()
   ...
ENDIF (CMAKE_SYSTEM_NAME MATCHES "Windows")
```

windows常用的编译选项

```bash
  add_definitions(-DWIN32)
  add_definitions(-DWIN32_LEAN_AND_MEAN)
  add_definitions(-D_WINSOCK_DEPRECATED_NO_WARNINGS)
  add_definitions(-D_CRT_SECURE_NO_WARNINGS)

  target_link_libraries(client ws2_32.lib)
```
