---
layout: post
title: "FSM-golang"
subtitle: '使用golang实现一个简单的状态机'
author: "Abel"
header-style: text
tags:
  - golang
  - Game
---

使用FSM（Finite State Machine）来制作怪物的AI，比较轻量级；

# 概念

状态机分为两大类：

| 名称          | 说明                                                                         |
| :------------ | :--------------------------------------------------------------------------- |
| Moore machine | 输出只和状态有关而与输入无关                                                 |
| Mealy machine | 输出不仅和状态有关而且和输入有关系（使用这种状态机通常可以减少状态的数量。） |

状态机可归纳为4个要素，即现态、条件、动作、次态。这样的归纳，主要是出于对状态机的内在因果关系的考虑。“现态”和“条件”是因，“动作”和“次态”是果。详解如下：

①现态：是指当前所处的状态。

②条件：又称为“事件”，当一个条件被满足，将会触发一个动作，或者执行一次状态的迁移。

③动作：条件满足后执行的动作。动作执行完毕后，可以迁移到新的状态，也可以仍旧保持原状态。动作不是必需的，当条件满足后，也可以不执行任何动作，直接迁移到新状态。

④次态：条件满足后要迁往的新状态。“次态”是相对于“现态”而言的，“次态”一旦被激活，就转变成新的“现态”了。

最首先状态机的概念是使用在电路，单片机相关的东西里面。

> 在刚才归纳的要素里面很重要的就是“状态”，“条件“，”动作“。



# 游戏中常用的状态机

[![DulcAU.png](https://s3.ax1x.com/2020/11/19/DulcAU.png)](https://imgchr.com/i/DulcAU)

| 要素 | 元素                                                                   |
| :--- | :--------------------------------------------------------------------- |
| 状态 | 待机状态</br>巡逻状态</br>追击状态</br>攻击状态                        |
| 条件 | 出现敌人</br>主动怪判断</br>遭到攻击</br>攻击范围检测</br>追击范围检测 |
| 动作 | 朝某个位置移动</br>施法                                                |

# 阅读 looplab/fsm 实现

[![DKZZLD.png](https://s3.ax1x.com/2020/11/19/DKZZLD.png)](https://imgchr.com/i/DKZZLD)

在创建状态机的时候需要指定状态之间切换的可能性；需要指定在状态切换的时候的调用。（状态是直接使用string来表示）

核心对象FMS，里面缓存了有限状态机的路由，并且能接受外部提供的Event的触发；

当Event区触发当前的有限状态机的时候，将会做状态的切换；

切换状态的时候，需要使用到 transitioner 对象；

参考实例代码：

```golang
package main

import (
    "fmt"
    "github.com/looplab/fsm"
)

// Door 门对象
type Door struct {
    To  string
    // FSM 有限状态机对象
    FSM *fsm.FSM
}

// NewDoor 新建门对象
// to 名称
func NewDoor(to string) *Door {
    d := &Door{
        To: to,
    }

    d.FSM = fsm.NewFSM(
        // 默认的状态名称
        "closed",
        fsm.Events{
            // 事件 open ，能将状态机从 closed 转换成 open 状态
            {Name: "open", Src: []string{"closed"}, Dst: "open"},
            // 事件 close ，能将状态机从 closed 转换成 open 状态
            {Name: "close", Src: []string{"open"}, Dst: "closed"},
        },
        fsm.Callbacks{
            // 给状态机注册 enter_state 回调函数
            "enter_state": func(e *fsm.Event) { d.enterState(e) },
        },
    )

    return d
}

// enterState 当进入新状态的回调
func (d *Door) enterState(e *fsm.Event) {
    fmt.Printf("The door to %s is %s\n", d.To, e.Dst)
}

func main() {
    door := NewDoor("heaven")

    // 发起 open 事件
    err := door.FSM.Event("open")
    if err != nil {
        fmt.Println(err)
    }

    // 发起 close 事件
    err = door.FSM.Event("close")
    if err != nil {
        fmt.Println(err)
    }
}
```

状态机本身只关心状态切换，他自己不关心这个事件生成；

# 参考
- [1] [状态机概念](http://wiki.cnki.com.cn/HotWord/88305.htm)
- [2] [状态机思路在单片机程序设计中的应用](http://www.elecfans.com/emb/danpianji/2009020923861.html)
- [3] [looplab/fsm有限状态机实现](https://github.com/looplab/fsm)
- [4] [smallnest/gofsm有限状态机实现](https://github.com/smallnest/gofsm)
- [4] [人工智能开发-决策方法](https://www.cnblogs.com/sevenyuan/p/5276320.html)
- [5] [erlang版本状态机](https://www.cnblogs.com/puputu/articles/1701012.html)
