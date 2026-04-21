const express = require("express");
const path = require('path');
const cors = require("cors");
const app = express();
const config = require("./config/default");
const jwt = require("./lib/jwt");
const db = require("./model/db");

app.use(express.static(__dirname + "/data"));


app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];
  
  const origin = req.headers.origin;
  
  // 动态检查来源，逻辑与你之前的 cors 配置保持一致
  if (!origin || allowedOrigins.includes(origin)) {
    // 如果 origin 为空（同源请求或某些非浏览器环境）或在白名单中，则允许
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  // 如果 origin 不在白名单中，则不设置 Access-Control-Allow-Origin 头，浏览器会拦截

  // 设置允许携带凭证
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 设置允许的请求方法
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');

  // 设置允许的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // 设置预检请求结果的缓存时间（24小时）
  res.setHeader('Access-Control-Max-Age', '86400');

  // 3. 处理预检请求 (OPTIONS)
  // if (req.method === 'OPTIONS') {
  //   return res.sendStatus(204); // 204 No Content 是预检请求的标准成功响应
  // }

  next();
});
// 删除原有的 app.options('*', ...) 代码块
// cors 中间件已经自动处理了 OPTIONS 请求

app.use(express.json());
// 核心代码：将 data/files 文件夹设置为静态资源目录
// 这意味着访问 /uploads/xxx.png 时，服务器会去 data/files/xxx.png 找文件
app.use('/uploads', express.static(path.join(__dirname, 'data/files')));
// Token 验证中间件
app.use((req, res, next) => {

   // OPTIONS 请求直接放行
  if (req.method === 'OPTIONS') {
    return next();
  }
  const publicApis = ['/isRegister', '/login', '/register',"/upload"];
  
  if (publicApis.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ code: 401, message: '未提供token' });
  }

  try {
    const decoded = jwt.verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: 'token无效或已过期' });
  }
});

// 引入路由
require("./routes/index")(app);
require("./routes/files")(app);

db.create();

app.listen(config.port, () => {
  console.log(`已启动服务，端口号${config.port}`);
});