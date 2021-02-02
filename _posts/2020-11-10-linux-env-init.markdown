---
layout: post
title: "Linux-环境配置"
subtitle: '初始化一台Linux机器'
author: "Abel"
header-style: text
tags:
  - Linux
  - operate
---
记录一下Linux运维相关的学习资料；

# Centos

```bash
yum install -y wget git screen libtool automake
yum install zlib-devel -y
yum install centos-release-scl
yum makecache
yum install devtoolset-7-gcc-c++ -y
yum install llvm-toolset-7 -y
yum install cmake -y
yum install python3-devel

# 安装gcc调试信息
debuginfo-install gcc
# 最后能切换gcc版本：
scl enable llvm-toolset-7 devtoolset-7 bash
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
pip install shadowsocks
mariadb-libs
mariadb-devel
yum install mariadb-server
systemctl start mariadb
systemctl enable mariadb

# 通过命令查看版本
yum info cmake

# 切换脚本，如果不想用了，可以将这个从
/etc/bashrc/profile
# 文件
source /opt/rh/llvm-toolset-7/enable
source /opt/rh/devtoolset-7/enable
```

## centos 7防火墙

### 检查防火墙状态

```bash
firewall-cmd --list-all
firewall-cmd --state
```

禁用随系统启动防火墙

```
systemctl disable firewalld
```

启用随系统启动防火墙

```
systemctl enable firewalld
```

关闭防火墙

```
systemctl stop firewalld
```

当前防火墙服务状态

```
systemctl status firewalld
```

永久开放防火墙端口

```bash
firewall-cmd --permanent --zone=public --add-port=52310-52320/tcp 
sudo firewall-cmd --zone=public --add-port=3000/tcp --permanent
```

重新加载防火墙规则

```
sudo firewall-cmd --reload
```

netcat 尝试端口连接

使用tcp4方式连接一个ip地址的端口

```
nc -4 ip_address port
nc --help
See the ncat(1) manpage for full options, descriptions and usage examples
man ncat
Ncat 7.50 ( https://nmap.org/ncat )
```

在帮助文件里面可以获取更多的信息。

```
       Connect to example.org on TCP port 8080.
           ncat example.org 8080

       Listen for connections on TCP port 8080.
           ncat -l 8080
```

检查端口情况

```
netstat -tnlp
``

检查当前

# Linux系统设置

locale设置

```
[root@vm10-0-2-2 raw_database]# locale
LANG=en_US.UTF-8
LC_CTYPE="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_COLLATE="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_PAPER="en_US.UTF-8"
LC_NAME="en_US.UTF-8"
LC_ADDRESS="en_US.UTF-8"
LC_TELEPHONE="en_US.UTF-8"
LC_MEASUREMENT="en_US.UTF-8"
LC_IDENTIFICATION="en_US.UTF-8"
LC_ALL=
```

如果发现有问题，可以通过在/etc/profile文件中添加

```
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"
```

## 检查coredump的配置

```
cat /proc/sys/kernel/core_pattern
```

一般我们将coredump文件生成目录重定向到一个固定的地方：

```
mkdir -p /data/cores/
chmod a+w /data/cores/ -R
echo "/home/cores/core-%e-%p-%t" > /proc/sys/kernel/core_pattern
```

设置ulimit

```
ulimit -n 65535  
ulimit -c unlimited
```

centos yum proxy

```
/etc/yum.conf
proxy=http://代理服务器IP地址:端口号
proxy=http://代理服务器IP地址:端口号
proxy_username=代理服务器用户名
proxy_password=代理服务器密码
```

centos安装python3.6

softwarecollections.org

```bash
# 1. Install a package with repository for your system:
# On CentOS, install package centos-release-scl available in CentOS repository
# and enable the testing repository:
$ sudo yum install centos-release-scl
$ sudo yum-config-manager --enable centos-sclo-rh-testing

# On RHEL, enable RHSCL and RHSCL-beta repositories for you system:
$ sudo yum-config-manager --enable rhel-server-rhscl-7-rpms
$ sudo yum-config-manager --enable rhel-server-rhscl-beta-7-rpms

# 2. Install the collection:
$ sudo yum install rh-python36

# 3. Start using software collections:
$ scl enable rh-python36 bash
```

# ubuntu

```bash
sudo apt-get update && apt-get upgrade
sudo apt-get install mariadb-server -y
sudo apt-get install unzip -y
sudo apt-get install zlib1g-dev -y
sudo apt-get install libmariadbclient-dev -y
sudo apt install p7zip-full -y
sudo apt install -y "screen"
sudo apt install clang-format -y
sudo apt-get install gcc-7 g++-7 -y
sudo apt-get install clang cmake unzip screen clang-format mariadb-server unzip golang python3-pip automake -y
sudo apt-get install git libmariadbclient-dev p7zip-full openssl -y
sudo apt-get install nodejs -y
sudo apt-get install gdb -y

apt update
sudo apt update
sudo apt upgrade
sudo apt install build-essential -y
sudo apt install ccache
sudo apt install dos2unix
apt -y install mariadb-server mariadb-client libmysqlclient-dev
apt install libmysqlclient-dev
apt install libcurl-dev
apt install autoconf -y
apt-get install manpages-dev glibc-doc libstdc++-10-doc

# libstdc++-10-doc This package contains documentation files for the GNU stdc++ library.

# screen 无法使用的问题，其实就是重定向一下 screen 的工作目录就好了
Cannot make directory '/run/screen': Permission denied
export SCREENDIR=$HOME/.screen
abel@xiaozanbiao:~/learn/c++/octopus_svr/octopus_svr/build$ screen -S abel
Directory /home/abel/.screen must have mode 700.
abel@xiaozanbiao:~/learn/c++/octopus_svr/octopus_svr/build$ chmod 700 ~/.screen/
abel@xiaozanbiao:~/learn/c++/octopus_svr/octopus_svr/build$ screen -S abel

# 2020/12/18 添加一个命令，记录当前某个进程的cpu，内存情况；
sudo apt install sysstat

#!/bin/bash
prog_name="your_programe_name"
prog_mem=$(pidstat  -r -u -h -C $prog_name |awk 'NR==4{print $12}')
time=$(date "+%Y-%m-%d %H:%M:%S")
echo $time"\tmemory(Byte)\t"$prog_mem >>~/record/prog_mem.log

抓取某个进程的内存使用情况；

pidstat -r -u -h -C Level 2 5

每2秒钟检测一次，持续5秒

CentOS7 如何升级Git

启用Wandisco GIT存储库，在此之前我们先写入新yum存储库配置文件，在终端输入：
vim /etc/yum.repos.d/wandisco-git.repo

[wandisco-git]
name=Wandisco GIT Repository
baseurl=http://opensource.wandisco.com/centos/7/git/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://opensource.wandisco.com/RPM-GPG-KEY-WANdisco

导入存储库GPG密钥
rpm --import http://opensource.wandisco.com/RPM-GPG-KEY-WANdisco

安装：
yum install git


```

# mysql

## 权限相关

安装完成之后，需要做一些简单的处理，防止安全问题。mysql最后限制访问的ip地址，给指定的ip地址开放访问的独立的密码。

```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'ip_address' IDENTIFIED BY 'yourpassword' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

使用这个命令将处理掉mysql的一些安全问题。

```bash
$ mysql_secure_installation
```

mysql 8.0 版本 root 密码修改

需要执行

```bash
flush privileges;
```

然后再执行

```bash
ALTER user 'root'@'localhost' IDENTIFIED BY 'root';--修改密码为root
create user if not exists 'root'@'%' identified by '123456';
GRANT ALL ON gamedata005.* TO 'root'@'%';
```

[MySQL8.0手册](https://dev.mysql.com/doc/refman/8.0/en/)

## 备份数据库

将某个数据库导出，不需要导出数据

```bash
$ mysqldump --no-create-db=TRUE --no-data=TRUE -h"ip_address" -uroot -pyourpassword gamedb_10001 > gamedb_10001.sql
```

具体参数可以通过mysqldump --help中看到。

直接创建数据库

```bash
mysql -h"ip_address" -uroot -pyourpassword -e "create database gamedb_30001"
```

将数据表创建到新库中

```bash
mysql -h"ip_address" -uroot -pyourpassword gamedb_30001 < gamedb_10001.sql
```

# 引用

- [1] [CentOS7 如何升级Git](https://www.cnblogs.com/mrbug/p/12030777.html)