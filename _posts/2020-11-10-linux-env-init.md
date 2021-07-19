---
layout: post
title: "Linux-环境配置"
subtitle: '初始化一台Linux机器'
author: "Abel"
header-style: text
tags:
  - Linux
  - 运维
---

- [Centos](#centos)
  - [centos 7防火墙](#centos-7防火墙)
    - [检查防火墙状态](#检查防火墙状态)
- [ubuntu](#ubuntu)
  - [apt 相关知识](#apt-相关知识)
- [mysql](#mysql)
  - [权限相关](#权限相关)
  - [备份数据库](#备份数据库)
- [cygwin多次grep没有输出](#cygwin多次grep没有输出)
- [ubuntu无法更新](#ubuntu无法更新)
- [WSL](#wsl)
- [引用](#引用)

记录一下Linux运维相关的学习资料；

# Centos

安装完，可以直接将`/etc/sysconfig/network-scripts/ifcfg-xxx`此选项打开`ONBOOT=yes`。这样一般都能上网了。

EPEL (Extra Packages for Enterprise Linux)是基于Fedora的一个项目，为“红帽系”的操作系统提供额外的软件包，适用于RHEL、CentOS和Scientific Linux.如果不安装这个库，将会少了很多的软件包。`yum -y install epel-release`

可以安装一下`zsh`，`autojump`，`autojump-zsh`，`oh-my-zsh`。自从2019年之后，`mac`就默认使用`zsh`代替了`bash`。

`git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh`

安装了`zsh`之后，可以通过执行`chsh`来设置成默认的shell。安装完成之后xshell工具的home键无法使用。可以通过在zshrc文件里面添加这些内容

```bash
bindkey '\e[1~' beginning-of-line
bindkey '\e[4~' end-of-line
```

参考文档[home-end-keys-in-zsh-dont-work-with-putty](https://stackoverflow.com/questions/161676/home-end-keys-in-zsh-dont-work-with-putty)

有时候会升级失败，这个还是由于git访问不流畅造成。
1. 先将本地的oh my zsh目录找到，通过git pull直接拉取最新的版本；
2. 执行这个指令 upgrade_oh_my_zsh 就能将版本升级好了。

常用的软件：

```sh
yum install -y wget git screen libtool automake
yum install zlib-devel -y
yum install centos-release-scl
yum makecache
yum install devtoolset-7-gcc-c++ -y
yum install llvm-toolset-7 -y
yum install cmake -y
yum install python3-devel

# 网路分析工具
yum install tcpdump

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

# 修改时区

cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

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

```bash
ulimit -n 65535  
ulimit -c unlimited

# 直接修改这个文件，在这个文件尾部放入3行
vi /etc/security/limits.conf

* soft nofile 65535
* hard nofile 65535
* soft core unlimited

```

centos yum proxy

```bash
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

# 抓取某个进程的内存使用情况；
# 每2秒钟检测一次，持续5秒
$ pidstat -r -u -h -C Level 2 5




# CentOS7 如何升级Git

# 启用Wandisco GIT存储库，在此之前我们先写入新yum存储库配置文件，在终端输入：
vim /etc/yum.repos.d/wandisco-git.repo

[wandisco-git]
name=Wandisco GIT Repository
baseurl=http://opensource.wandisco.com/centos/7/git/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://opensource.wandisco.com/RPM-GPG-KEY-WANdisco

# 导入存储库GPG密钥
rpm --import http://opensource.wandisco.com/RPM-GPG-KEY-WANdisco


# 安装：

yum install git


# 安装文档输出；

sudo apt install graphviz

```

## apt 相关知识

[使用apt-get查询安装指定版本的软件](https://blog.csdn.net/yjk13703623757/article/details/78945576)

```bash
apt-cache show libjemalloc-dev
Package: libjemalloc-dev
Architecture: amd64
Version: 5.2.1-1ubuntu1
Priority: extra
Section: universe/libdevel
Source: jemalloc
Origin: Ubuntu
Maintainer: Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>
Original-Maintainer: Faidon Liambotis <paravoid@debian.org>
Bugs: https://bugs.launchpad.net/ubuntu/+filebug
Installed-Size: 2748
Depends: libjemalloc2 (= 5.2.1-1ubuntu1)
Suggests: binutils
Filename: pool/universe/j/jemalloc/libjemalloc-dev_5.2.1-1ubuntu1_amd64.deb
Size: 424588
MD5sum: f519936da1e4557812ebad9cbf9e1029
SHA1: 2e5e464c4c2f051b7f32ed44a805bd7f08ec3738
SHA256: c5d64ba693ad45dd7c41f1d103a74816482601f7d0272ed49fc5441e9e1deb91
Homepage: http://jemalloc.net/
Description-en: development files and documentation for jemalloc
 Files used for development with jemalloc. This package contains
 headers and documentation.
 .
 jemalloc is a library providing a malloc(3) implementation for
 multi-threaded processes on multi-processor systems.
Description-md5: f91b42ea17991369b6b9cd46f2828e3f
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

# cygwin多次grep没有输出

在.bashrc文件里面增加这一句：

```bash
alias grep='grep --color --line-buffer'                     # show differences in colour
```

发现grep失效，无法做正确输出。google研究了一下，原因如下：

管道 | 是全缓冲的，一般来说buffer_size为4096，有些是8192。不管具体值多少，只有buffer_size满了，才会看到输出。

在操作里  >>file 这个操作也是全缓冲的。调整如下

tail -f log | grep --line-buffer xxx | grep --line-buffer yyy

结果输出正常。

grep当带上了 --line-buffer 的时候，每输出一行，就刷新一次。

在unix里，块设备和普通文件，以及管道都是全缓冲的。

# ubuntu无法更新

```bash
The following packages have unmet dependencies
```

后来我把阿里源换回Ubuntu原生的源就可以安装了，因为阿里源的包太新。[转载原文](https://www.cnblogs.com/willaty/p/9522591.html)

# WSL

```powershell
# WSL-Ubuntu18.04 LTS 重启方法
# 以管理员权限运行cmd
>net stop LxssManager	//停止
>net start LxssManager	//启动

# 将WSL搬家
# 首先查看所有分发版本
> wsl -l --all  -v
# 导出分发版为tar文件到d盘
> wsl --export Ubuntu-20.04 d:\ubuntu20.04.tar
# 注销当前分发版
> wsl --unregister Ubuntu-20.04
# 重新导入并安装分发版在d:\ubuntu
wsl --import Ubuntu-20.04 d:\ubuntu d:\ubuntu20.04.tar --version 2
# 设置默认登陆用户为安装时用户名
ubuntu2004 config --default-user Username
# 删除tar文件(可选)
del d:\ubuntu20.04.tar
# 这个操作，完成之后我的WSL也从1升级到2了。
# 升级了之后，WSL完全拥有独立的ip地址；
```

```bash
Linux找出全部可执行文件，并且删除掉。
ls -F|grep '*' | sed 's#*##g' | xargs rm
参考网站： https://www.cnblogs.com/binyue/p/4707948.html

```

[GPG生成](https://www.freesion.com/article/6352795169/)

```bash
We need to generate a lot of random bytes
# 通过 yum install rng-tools完成安装。
# 之后再执行命令：rngd -r /dev/urandom，生成**就能瞬间完成了。
```


# 引用

- [1] [CentOS7 如何升级Git](https://www.cnblogs.com/mrbug/p/12030777.html)
- [2] [多次grep没有输出](https://blog.csdn.net/weixin_33797791/article/details/89593991)