---
layout: post
title: "BehaviorTree"
subtitle: 'BehaviorTree'
author: "Abel"
header-style: text
tags:
  - AI
  - Game
---

在制作游戏里面，除了使用FSM，还有一种实现模式：行为树。编写本文用于梳理行为树中的概念，知识点。里面使用到了三方库来编辑行为树(behavior3.com)。行为树主要用于做系统控制的，能通过简单的节点组合，编辑出复杂的逻辑。

# 概述

# 节点

## 1. composite

组合节点，可以连接多个子节点，用于决策行为树走向。

### 1.1. Sequence &

Sequence 节点 顺序执行子节点，当子节点返回b3.SUCCESS直接访问下一个子节点，直到所有子节点都返回b3.SUCCESS，才从当前节点返回b3.SUCCESS，当子节点返回b3.FAILURE，则直接从当前节点返回b3.FAILURE 类似于逻辑与&的概念。

### 1.2. Priority |

Priority 节点 选择执行子节点，当子节点返回b3.FAILURE直接访问下一个子节点，直到所有子节点都返回b3.FAILURE，才从当前节点返回b3.FAILURE，当子节点返回b3.SUCCESS，则直接从当前节点返回b3.SUCCESS 类似于逻辑或|的概念。

### 1.3. MemSequence &

MemSequence 节点 逻辑和Sequence一样，但是这里涉及到一个b3.RUNNING的返回值，就是子节点并不知道执行结果是成功还是失败，需要等后续才知道是否成功。其实就是异步的节点。

对于Sequence节点，当它再次遍历子节点的时候，还是从第一个子节点开始遍历，但是MemSequence却会记住之前在Running的子节点,然后下次遍历的时候，直接从Running的那个子节点开始，这可以很方便的继续之前中断的逻辑决策。

比如一个怪物，它的技能有3段，就可以通过这样的节点来组织。

### 1.4. MemPriority |

可以类似于Priority，加上了Mem前缀的意义，已经在1.3. 章节论述过了。

## 2. decorators

装饰节点， 可以连接一个子节点， 用于修饰子节点的返回值

### 2.1. Repeator

Repeator 节点，重复执行子节点maxLoop次

### 2.2. RepeatUntilFailure

RepeatUnitilFailure 节点 ，重复执行子节点直到子节点返回Failure

### 2.3. RepeatUntilSuccess

RepeatUntilSuccess 节点，重复执行子节点直到子节点返回Success

## 3. condition

条件节点， 可以用于做出判断并返回不同的值

## 4. action

行为节点， 可以执行行为。

# 参考

- [1] [Wiki行为树](https://en.wikipedia.org/wiki/Behavior_tree_(artificial_intelligence,_robotics_and_control))
- [2] [百度百科行为树](https://baike.baidu.com/item/%E8%A1%8C%E4%B8%BA%E6%A0%91/22735785?fr=aladdin)
- [3] [behavior3editor_github](https://github.com/behavior3/behavior3editor)
