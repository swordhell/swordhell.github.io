---
layout: post
title: "golang socket 尝试"
subtitle: 'golang socket 尝试'
author: "Abel"
header-style: text
tags:
  - golang
  - socket
---

收集一些golang常用的一些技术。

---

- [服务器部分](#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%83%A8%E5%88%86)
- [客户端部分](#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%83%A8%E5%88%86)
- [通过让主线程等待事件](#%E9%80%9A%E8%BF%87%E8%AE%A9%E4%B8%BB%E7%BA%BF%E7%A8%8B%E7%AD%89%E5%BE%85%E4%BA%8B%E4%BB%B6)
- [数据解析、填报代码](#%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90%E5%A1%AB%E6%8A%A5%E4%BB%A3%E7%A0%81)
- [发送数据的实例](#%E5%8F%91%E9%80%81%E6%95%B0%E6%8D%AE%E7%9A%84%E5%AE%9E%E4%BE%8B)
- [知识点：](#%E7%9F%A5%E8%AF%86%E7%82%B9)

[参考【leaf】](https://github.com/name5566/leaf) 初步学着编写一个tcp服务器，一个连接他的client。

# 服务器部分

```golang
import (
	"net"
	"os"
)

func Start() {
	l, err := net.Listen("tcp", "127.0.0.1:8866")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
  go main_loop(l)
  
  // ...
}
func main_loop(l net.Listener) {
	for {
		conn, err := l.Accept()
		if err != nil {
			fmt.Println(err.Error())
			continue
		}
		go client_loop(conn)
	}
}

func client_loop(conn net.Conn) {
	fmt.Println(conn.RemoteAddr().String())
  // ...
}

```

# 客户端部分

```golang
import (
	"fmt"
	"net"
)
func main() {
	conn, err := net.Dial("tcp", "127.0.0.1:8866")
	if err != nil {
		fmt.Println(err)
		return
	}

	go handleClient(conn)
  // ...
}

func handleClient(conn net.Conn) {
  //....
}
```

# 通过让主线程等待事件

```go
import (
	"os/signal"
)
	
func main() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, os.Kill)
	sig := <-c
	fmt.Println(sig.String())
}
```

# 数据解析、填报代码
下面的代码是简单的从socket里面读取数据，在数据头上增加一个头，little-endian方式的uint16。后面是一块数据.
```go
import (
	"encoding/binary"
	"errors"
	"io"
	"net"
)

// --------------
// | len | data |
// --------------
type MsgPack struct {
	maxMsgLen    uint16
}

func NewMsgPack() *MsgPack {
	p := new(MsgPack)
	p.maxMsgLen = 4096

	return p
}

func (c *MsgPack) ReadPack(session net.Conn) ([]byte, error) {
	var headData []byte = make([]byte, 2)
	if _, err := io.ReadFull(session, headData); err != nil {
		return nil, err
	}
	msgLen := uint16(binary.LittleEndian.Uint16(headData))
	if msgLen > c.maxMsgLen {
		return nil, errors.New("message too long")
	}

	msgData := make([]byte, msgLen)
	if _, err := io.ReadFull(session, msgData); err != nil {
		return nil, err
	}

	return msgData, nil
}

// goroutine safe
func (p *MsgPack) WritePack(conn net.Conn, args ...[]byte) error {
	// get len
	var msgLen uint16
	for i := 0; i < len(args); i++ {
		msgLen += uint16(len(args[i]))
	}

	// check len
	if msgLen > p.maxMsgLen {
		return errors.New("message too long")
	}

	msg := make([]byte, uint32(2)+uint32(msgLen))

	// write len
	binary.LittleEndian.PutUint16(msg, uint16(msgLen))

	// write data
	l := 2
	for i := 0; i < len(args); i++ {
		copy(msg[l:], args[i])
		l += len(args[i])
	}

	conn.Write(msg)

	return nil
}

```

# 发送数据的实例

```go
buf := []byte("hello dial person! abel is online!")
pack.WritePack(conn, buf)
```

# 知识点：
* 通过struct组织数据结构
* 启动go里面的一个进程来处理数据包
* 挂载signal处理
* tcp的包拆解
* 大端小端解析integer的基本用法
* 报错处理