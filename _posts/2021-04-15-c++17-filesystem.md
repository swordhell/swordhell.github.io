---
layout: post
title: "c++17-filesystem"
subtitle: 'c++17-filesystem'
author: "Abel"
header-style: text
tags:
  - C++
---

记录一下filesystem相关知识，需要开启c++17标准。

# path相关操作

## 目录操作

```cpp
// 获取绝对路径
std::filesystem::absolute(std::filesystem::current_path().append(filename_));
// 获得目录分割
std::filesystem::path::preferred_separator;
```

## 遍历目录

```cpp
#include <fstream>
#include <iostream>
#include <filesystem>
namespace fs = std::filesystem;
 
int main()
{
    fs::create_directories("sandbox/a/b");
    std::ofstream("sandbox/file1.txt");
    std::ofstream("sandbox/file2.txt");
    for(auto& p: fs::directory_iterator("sandbox"))
        std::cout << p.path() << '\n';
    fs::remove_all("sandbox");
}

output:
"sandbox/a"
"sandbox/file1.txt"
"sandbox/file2.txt"
```

## 获取文件名

```cpp
		auto log_path = fs::absolute(log_path_).string();
		auto logger_name = fs::path(log_path).stem().string();
```

# 引用
- [1][Filesystem library](https://en.cppreference.com/w/cpp/filesystem)
