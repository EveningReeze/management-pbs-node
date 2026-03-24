// 启动服务器的文件
const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config/default");
const jwt = require("./lib/jwt");
const  db = require("./model/db")  //调用数据库
//加入静态文件
app.use(express.static(__dirname + "/data"));

//设置跨域
// 使用cors中间件
app.use(
  cors({
    // origin: 配置允许访问的源（域名）
    // '*' 表示允许所有域名访问（最宽松但最不安全）
    // 生产环境中应该设置为具体的域名，如：['https://example.com', 'https://admin.example.com']
    // 注意：当credentials为true时，origin不能使用'*'
    origin: "*",

    // credentials: 是否允许发送凭证信息（如cookies、HTTP认证）
    // true: 允许前端发送和接收凭证
    // 注意：当设置为true时，origin必须指定具体的域名，不能使用'*'
    credentials: true,
    // methods: 允许的HTTP方法列表
    // 这里配置了常见的RESTful API方法
    // GET - 获取资源
    // POST - 创建资源
    // PUT - 更新整个资源
    // DELETE - 删除资源
    // OPTIONS - 预检请求（CORS必须）
    // PATCH - 部分更新资源
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

    // allowedHeaders: 允许客户端发送的HTTP头部列表
    // Origin - 请求来源（CORS必须）
    // X-Requested-With - 标识AJAX请求
    // Content-Type - 请求体类型（如application/json）
    // Accept - 客户端期望的响应类型
    // 可以根据需要添加其他头部，如：'Authorization', 'X-API-Key'等
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],

    // 其他可选配置（未在此示例中使用）：
    // exposedHeaders: 允许客户端访问的响应头列表
    // maxAge: 预检请求的缓存时间（秒）
    // preflightContinue: 是否将OPTIONS请求传递给下一个中间件
    // optionsSuccessStatus: OPTIONS请求的成功状态码（默认204）
  }),
);
app.use(express.json()); //解析前端数据


app.use(async (req, res, next) => {
  // console.log('请求路径:', req.path);
  // console.log('请求体:', req.body);
  // console.log('token值:', req.body?.token);
  // 公开接口列表（不需要token）
  const publicApis = ['/isRegister', '/login', '/register'];
  
  // 如果是公开接口，直接放行
  if (publicApis.includes(req.path)) {
    return next();
  }
  
  // 获取token
  const token = req.body?.token || req.headers?.authorization?.split(' ')[1];
  
  // 验证token
  if (!token) {
    return res.status(401).json({ code: 401, message: '未提供token' });
  }
  
  try {
    const isValid = jwt.verifyToken(token);
    if (isValid === 1) {
      next();
    } else {
      res.status(401).json({ code: 401, message: 'token无效' });
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: 'token验证失败' });
  }
});


require("./routes/index")(app);
db.create();  // 在服务器启动前执行

app.listen(config.port, () => {
  console.log(`已启动服务，端口号${config.port}`);
});

