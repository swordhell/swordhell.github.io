---
layout: post
title: "python日志加工"
subtitle: 'python日志加工'
author: "Abel"
header-style: text
tags:
  - python
---

分析日志相关的脚本用的比较多。

# 环境搭建

## python

Python 3.9.0

# 实际需要掌握的技巧

## 正则表达式

```python
# [18:57:52] [INF] GiftItemLog buy rid: 15909, ID: 601, Type: 6, Rmb: 30
re_buy = re.compile("GiftItemLog buy rid: ([0-9_]+), ID: ([0-9_]+), Type: ([0-9_]+), Rmb: ([0-9_]+)")
```

## 按照utf-8来读写文件,按照行读取文件

```python
c_fd = codecs.open('./insert_create.sql', 'w', encoding='utf-8')
with codecs.open('./2020-04-22.log', 'r', encoding='utf-8') as fd:
    while True:
        line = fd.readline()
        if not line: break
c_fd.close()
```

## 写入excel中

# 参考
