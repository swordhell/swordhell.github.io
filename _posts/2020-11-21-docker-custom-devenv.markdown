---
layout: post
title: "docker自定义环境"
subtitle: 'docker自定义环境'
author: "Abel"
header-style: text
tags:
  - docker
  - Linux
---

学习docker，自定义运行环境；收集一些信息来做参考；慢慢收集信息。

Dockerfile其实就是构建image的text文本。

# 头部
```dockerfile
# 定制的镜像都是基于 FROM 的镜像
FROM centos:7.7.1908
MAINTAINER xxx@xxx.com
# 定制文件目录
WORKDIR /root
```

# 运行程序
```dockerfile
# 依赖包和sshd配置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && mkdir -p .ssh php /app/data/site /app/local/nginx/conf/vhosts \
    && yum install -y procps-ng iproute net-tools less wget bzip2 \
    openssh-clients openssh-server \
    gcc gcc-c++ autoconf automake libtool make cmake \
    zlib-devel openssl-devel pcre-devel \
    libaio curl-devel libxml2-devel glibc-devel glib2-devel gd-devel gd2-devel libjpeg-devel libpng-devel freetype-devel \
    && ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key \
    && ssh-keygen -t dsa -f /etc/ssh/ssh_host_dsa_key

RUN tar zxf openssl-1.1.1c.tar.gz \
    && tar zxf nginx-1.14.2.tar.gz \
    && cd nginx-1.14.2 \
    && ./configure --user=www --group=www \
    --prefix=/app/local/nginx \
    --with-http_stub_status_module \
    --with-openssl=../openssl-1.1.1c \
    --with-openssl-opt='enable-tls1_3 enable-weak-ssl-ciphers' \
    --with-http_ssl_module \
    --with-http_realip_module \
    --with-http_sub_module \
    --with-pcre \
    --with-http_v2_module \
    && make -j2 && make install \
    && cd && rpm -ivh filebeat-7.5.1-x86_64.rpm \
    && rm -rf nginx-* openssl-1.1.1c* filebeat* \
    && useradd www
# 复制权限文件
COPY authorized_keys /root/.ssh/authorized_keys
```

# EXPOSE

仅仅只是声明端口

```dockerfile
EXPOSE 22 80
```

# ENV

设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。

```dockerfile
ENV <key> <value>
ENV <key1>=<value1> <key2>=<value2>...
```
# USER
用于指定执行后续命令的用户和用户组，这边只是切换后续命令执行的用户（用户和用户组必须提前已经存在）。

格式：

```dockerfile
USER <用户名>[:<用户组>]
```

# ARG
构建参数，与 ENV 作用一至。不过作用域不一样。ARG 设置的环境变量仅对 Dockerfile 内有效，也就是说只有 docker build 的过程中有效，构建好的镜像内不存在此环境变量。

构建命令 docker build 中可以用 --build-arg <参数名>=<值> 来覆盖。

格式：
```dockerfile
ARG <参数名>[=<默认值>]
```


- [1] [菜鸟Dockerfile说明](https://www.runoob.com/docker/docker-dockerfile.html)
- [2] [官网参考](https://docs.docker.com/engine/reference/builder/)
- [3] [Dockerfile命令详解（超全版本）](https://www.cnblogs.com/dazhoushuoceshi/p/7066041.html)
