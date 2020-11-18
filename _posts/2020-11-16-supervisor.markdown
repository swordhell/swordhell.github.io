---
layout: post
title: "Supervisor使用详解"
subtitle: 'Supervisor使用详解'
author: "Abel"
header-style: text
tags:
  - Linux
  - Python
---

# 简介
supervisor是用Python开发的一个client/server服务，是Linux/Unix系统下的一个进程管理工具。可以很方便的监听、启动、停止、重启一个或多个进程。用supervisor管理的进程，当一个进程意外被杀死，supervisor监听到进程死后，会自动将它重启，很方便的做到进程自动恢复的功能，不再需要自己写shell脚本来控制。

# 安装

```bash
# ubuntu安装：
sudo apt-get install supervisor
# centos安装
yum install -y supervisor
```

检查是否一个守护进程

```bash
[root@test-qingzhou-01 supervisord.d]# ps aux |grep supervisord
root      4154  0.0  0.1  56144 15060 pts/0    Ss+  13:31   0:00 /usr/bin/python /usr/bin/supervisord -nc /etc/supervisor/supervisord.conf
# 手动启动方式
supervisord -c /etc/supervisor/supervisord.conf
# 手动关闭
ps aux |grep -v grep | grep supervisord | awk '{print $2}' |xargs kill -2
```

# 配置

系统配置位置：

```bash
/etc/supervisor/supervisord.conf

开启一个http的服务，方便外部访问：
[inet_http_server]         ; inet (TCP) server disabled by default
 port=0.0.0.0:10080        ; (ip_address:port specifier, *:port for all iface)                                                  
 username=user              ; (default is no username (open server))
 password=123               ; (default is no password (open server))

# 修改默认进程数字：
minfds=65535                ; (min. avail startup file descriptors;default 1024)
minprocs=65535              ; (min. avail process descriptors;default 200)

```

配置自己的ini
```ini

[group:qzsrv3]
programs=Lobby,Gateway,Scene,Matcher,Level,DBServer

[program:Login]
directory=/home/teamcityagent/BuildAgent/work/5c951883da1eba28/server/bin
command=/home/teamcityagent/BuildAgent/work/5c951883da1eba28/server/bin/Login srv3
autostart=false
autorestart=unexpected
startsecs=1
stderr_logfile=/home/teamcityagent/BuildAgent/work/5c951883da1eba28/server/log/Login.err.log
stdout_logfile=/home/teamcityagent/BuildAgent/work/5c951883da1eba28/server/log/Login.log
user=teamcityagent

```

# 问题

```bash
[root@test-qingzhou-01 supervisor]# /usr/local/bin/supervisord -c ./supervisrd.conf 
Error: Another program is already listening on a port that one of our HTTP servers is configured to use.  Shut this program down first before starting supervisord.

[root@test-qingzhou-01 supervisor]# find / -name supervisor.sock
/run/supervisor/supervisor.sock
/var/lib/docker/overlay2/d6de9ac36e7b3c66fed11ddb3cf384a18932d3f8044dda5bb2247476604acd71/diff/run/supervisor.sock
/var/lib/docker/overlay2/d6de9ac36e7b3c66fed11ddb3cf384a18932d3f8044dda5bb2247476604acd71/merged/run/supervisor.sock
[root@test-qingzhou-01 supervisor]# unlink /run/supervisor/supervisor.sock
[root@test-qingzhou-01 supervisor]# unlink /var/lib/docker/overlay2/d6de9ac36e7b3c66fed11ddb3cf384a18932d3f8044dda5bb2247476604acd71/diff/run/supervisor.sock
[root@test-qingzhou-01 supervisor]# unlink /var/lib/docker/overlay2/d6de9ac36e7b3c66fed11ddb3cf384a18932d3f8044dda5bb2247476604acd71/merged/run/supervisor.sock
unlink: cannot unlink ‘/var/lib/docker/overlay2/d6de9ac36e7b3c66fed11ddb3cf384a18932d3f8044dda5bb2247476604acd71/merged/run/supervisor.sock’: No such file or directory
```

# web

在后台能直接操作服务器启动

[![DAtsTe.png](https://s3.ax1x.com/2020/11/16/DAtsTe.png)](https://imgchr.com/i/DAtsTe)


# 参考
- [1] [Supervisor 使用详解](https://www.jianshu.com/p/0b9054b33db3)
- [2] [Supervisor官网](http://supervisord.org/)
- [3] [进程管理supervisor的简单说明](https://www.cnblogs.com/zhoujinyi/p/6073705.html)
- [4] [supervisor 使用详解](https://blog.csdn.net/zou79189747/article/details/80403016)
