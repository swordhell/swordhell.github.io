---
layout: post
title: "golang protobuf 尝试"
subtitle: '尝试使用在golang里面使用protobuf'
author: "Abel"
header-style: text
tags:
  - golang
---

protobuf是比较好的一种序列化的工具，这里使用golang来试用一下protobuf

 [protobuf模块](https://github.com/golang/protobuf)  [参考文档](https://developers.google.com/protocol-buffers/docs/gotutorial) 

# 准备工具
安装命令

![](https://swordhell.github.io/img/pic/20181201080640-install-go-protocol1.png)

安装效果

![](https://swordhell.github.io/img/pic/20181201080640-install-go-protocol2.png)

环境变量配置

![](https://swordhell.github.io/img/pic/20181201080640-install-go-protocol3.png)


# 定义protobuf

```protobuf
syntax = "proto3";
package example;

message Person {
  string name = 1;
  int32 id = 2;  // Unique ID number for this person.
  string email = 3;

  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }

  message PhoneNumber {
    string number = 1;
    PhoneType type = 2;
  }

  repeated PhoneNumber phones = 4;

}

// Our address book file is just one of these.
message AddressBook {
  repeated Person people = 1;
}
```

# 生成go文件
```
protoc.exe -I=D:/gopath/src/IDL --go_out=./ D:/gopath/src/IDL/addressbook.proto
```

# 编写序列化、反序列化代码
[参考代码](https://github.com/protocolbuffers/protobuf/blob/master/examples/list_people_test.go)

```go
package main

import (
	"fmt"

	"github.com/golang/protobuf/proto"

	pb "octopus.com/test/test_protobuf/example"
)

func main() {

	p := &pb.Person{
		Id:    1234,
		Name:  "John Doe",
		Email: "jdoe@example.com",
		Phones: []*pb.Person_PhoneNumber{
			{Number: "555-4321", Type: pb.Person_HOME},
		},
	}

	fmt.Println(p)

	out, err := proto.Marshal(p)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(out)

}

```

输出：
```console
name:"John Doe" id:1234 email:"jdoe@example.com" phones:<number:"555-4321" type:HOME > 
[10 8 74 111 104 110 32 68 111 101 16 210 9 26 16 106 100 111 101 64 101 120 97 109 112 108 101 46 99 111 109 34 12 10 8 53 53 53 45 52 51 50 49 16 1]
```

