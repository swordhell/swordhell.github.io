---
layout: post
title: "lua使用protobuf"
subtitle: 'lua中使用protobuf'
author: "Abel"
header-style: text
tags:
  - protobuf
  - lua
---
protobuf是比较好的一种序列化的工具，这里使用lua来试用一下protobuf。文章内容是通过网络收集的知识
---


[pbc下载地址](https://github.com/cloudwu/pbc)
[protobuf下载地址](https://github.com/protocolbuffers/protobuf)

protoc工具支持将protobuf 3.5.1导出c语言用。
```
$ protoc -I={proto_path} -o{output_path}/{filename}.pb {filename}.proto
```

lua中使用：
```lua
module("test_protobuf",package.seeall)
protobuf  = require "protobuf"

function init_protobuf()
    local addr = io.open("./proto/mx_svr.pb","rb")
    local buffer = addr:read "*a"
    addr:close()
    protobuf.register(buffer)
end

function decode_data(_node)
    local msg, info = protobuf.decode("mx_svr.W2GPack", _node.data, #_node.data)
    
    if type(msg) == "boolean" then
        print("decode_data protobuf.decode failed, info: ", info)
        return false, msg
    end
    return true, msg
end

function encode_data(_tbl)
    local buffer = protobuf.encode("mx_svr.W2GPack", _tbl)
    return buffer

end
```
