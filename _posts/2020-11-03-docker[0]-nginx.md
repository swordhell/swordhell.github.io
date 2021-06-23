---
layout: post
title: "docker运行nginx"
subtitle: 'docker'
author: "Abel"
header-style: text
tags:
  - 运维
---
学习docker

# 简介

docker是为了简化外网服务器软件环境部署的工作。现在初浅的理解是，可以在linux机器上通过docker单独安装mysql,nginx,应用程序的也可以跑在一个docker之上。

* Docker 包括三个基本概念:

- 镜像（Image）：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
- 容器（Container）：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
- 仓库（Repository）：仓库可看着一个代码控制中心，用来保存镜像。

# 安装

参考了[腾讯在线实验](https://cloud.tencent.com/developer/labs/lab/10054) [菜鸟入门](https://www.runoob.com/docker/centos-docker-install.html) 可以很快速的将docker部署到你的服务器上。

- 可能需要卸载掉老的docker

```bash
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

- 设置仓库
  
```bash
$ sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
$ sudo yum install docker-ce docker-ce-cli containerd.io
```

- 安装
  
```bash
$ sudo yum install docker-ce docker-ce-cli containerd.io
```

安装完成之后，可以通过docker -v来查看当前docker的版本信息。

- 使用国内加速

创建或修改 /etc/docker/daemon.json 文件

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

# 基本操作

- 运行一个容器
```
docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
```

- 查询容器
```
docker ps -a
```

- 使用 docker start 启动一个已停止的容器：
```
docker start b750bbbcfd88
```

- 后台运行 （增加-d的指令）
```
docker run -itd --name ubuntu-test ubuntu /bin/bash
```

- 停止一个容器

```
docker stop <容器 ID>
```
- 进入容器

docker attach 如果从这个容器退出，会导致容器的停止。

docker exec：推荐大家使用 docker exec 命令，因为此退出容器终端，不会导致容器的停止。

```
docker attach 1e560fca3906 
docker exec -it 243c32535da7 /bin/bash
```

- 导出和导入容器

```
docker export 1e560fca3906 > ubuntu.tar
```

- 导入容器快照
```
cat docker/ubuntu.tar | docker import - test/ubuntu:v1
```

- 下面的命令可以清理掉所有处于终止状态的容器。
```
docker container prune
```
更多指令可以后续补充

# 安装mysql
> [参考菜鸟入门mysql安装](https://www.runoob.com/docker/docker-install-mysql.html) 

> [使用Docker搭建MySQL服务](https://www.cnblogs.com/sablier/p/11605606.html)


```
# 拉取mysql5.7版本
docker pull mysql:5.7   # 拉取 mysql 5.7
# 检查版本
docker images
# 启动mysql
docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
```
- -–name：容器名，此处命名为mysql
- -e：配置信息，此处配置mysql的root用户的登陆密码
- -p：端口映射，此处映射 主机3306端口 到 容器的3306端口
- -d：源镜像名，此处为 mysql:5.7

# 安装nginx
```
# 拉取版本
docker pull nginx:latest
# 检查版本
docker images
# 启动docker中的nginx
docker run --name nginx-test -p 8080:80 -d nginx
```
- --name nginx-test：容器名称。
- -p 8080:80： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
- -d nginx： 设置容器在在后台一直运行。

可能需要去修改nginx里面的配置项目，我需要将这个服务器端口映射出来。
[docker 安装nginx 并部署](https://blog.csdn.net/ddhsea/article/details/92203713。
里面有3个步骤
```
# 在自己目录下创建这些文件夹
mkdir -p ~/nginx/www ~/nginx/logs ~/nginx/conf
# 将容器中的nginx文件拷贝出来，通过docker ps出来实例编号。
sudo docker cp 3bd71361a112:/etc/nginx/nginx.conf ~/nginx/conf
# 启动的时候，绑定映射关系
docker run --name yzgmweb -d -p 35981:8088 \
    -v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf\
    -v /root/nginx/www:/usr/share/nginx/html\
    -v /root/nginx/logs:/var/log/nginx -d docker.io/nginx
```
- -p 8080:80： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
- -v ~/nginx/conf/nginx.conf:/etc/nginx/nginx.conf 将本地文件映射到容器内部。

# 扩展
后续如果有时间，可以再去研究一下 docker compose & swarm；dockerfile之类的东西。再做记录。

# 修改docker ulimit

[How to increase number of open files limit]](https://mtyurt.net/post/docker-how-to-increase-number-of-open-files-limit.html)

docker run --ulimit nofile=90000:90000 <image-tag>

# 引用
- [官方网站](https://www.docker.com/)
- [菜鸟入门](https://www.runoob.com/docker/docker-tutorial.html)
- [腾讯在线实验](https://cloud.tencent.com/developer/labs/lab/10054)
- [Docker中安装nginx与自定义配置](https://www.jianshu.com/p/721d971c3cd7)
- [docker compose swarm](https://www.cnblogs.com/youclk/p/8453526.html)