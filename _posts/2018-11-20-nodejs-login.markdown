---
layout: post
title: "node.js http 尝试"
subtitle: 'node.js http 常用的方法'
author: "Abel"
header-style: text
tags:
  - node.js
  - http
  - express
  - mysql operate
---
收集一些node.js常用的一些技术。

---
<!-- TOC -->autoauto- [1. 初始化express做http服务器](#1-初始化express做http服务器)auto- [2. 提供一个post处理函数](#2-提供一个post处理函数)auto- [3. md5 hash](#3-md5-hash)auto- [4. mysql](#4-mysql)auto    - [4.1. select](#41-select)auto    - [4.2. insert](#42-insert)auto    - [4.3. delete](#43-delete)autoauto<!-- /TOC -->

# 1. 初始化express做http服务器

```js
// cnpm install express-session
// cnpm install express
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// 设置body解析器
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../dist')));

// 设置session
app.use(session({
  secret:'today is a holiday',
  resave:true,
  saveUninitialized:false,
  cookie:{
      maxAge:1000*60*10 //过期时间设置(单位毫秒)
  }
}));

// 重定向到index.html文件中
app.get('/*', function (req, res) {
  console.log("get " + req.url);
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// 监听
app.listen(8081, function () {
  console.log('success listen... http://127.0.0.1:8081');
});
```

# 2. 提供一个post处理函数
```js
app.post('/login/regist',urlencodedParser,function(req, res){
  console.log("POST 请求 /login/regist " + req.body.username + " " + req.body.password );
  var s = JSON.stringify({
      code: 50001,
      message: 'error code!'
    });
    res.send(s);
}
```
# 3. md5 hash
```js
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var md5_passwd = md5.update(password).digest('hex').toLowerCase();
```

# 4. mysql
```js
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'usrnode',
  password : '123456',
  port: '3306',
  database: 'nodedb',
});
connection.connect();
connection.query(sql, function (error, results, fields) {
    cb(error, results, fields);
  });
```
[参考原文](http://www.runoob.com/nodejs/nodejs-mysql.html)
