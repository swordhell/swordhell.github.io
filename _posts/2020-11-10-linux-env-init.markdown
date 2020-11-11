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
新安装一台Linux机器的时候，需要做到一些事情；
---

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
sudo apt-get install clang cmake unzip screen clang-format mariadb-server unzip golang python3-pip -y
sudo apt-get install git libmariadbclient-dev p7zip-full openssl -y
sudo apt-get install nodejs -y
sudo apt-get install gdb -y

apt update
sudo apt update
sudo apt upgrade
sudo apt install build-essential -y
sudo apt install ccache
sudo apt install dos2unix
apt -y install mariadb-server mariadb-client
apt install libmysqlclient-dev
apt install libcurl-dev
apt install autoconf -y
apt-get install manpages-dev glibc-doc
```
