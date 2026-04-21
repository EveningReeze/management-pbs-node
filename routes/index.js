const serve = require("../controller/serve");
const jwtUtil = require("../lib/jwt"); // 引入 jwt 工具

// 定义一个中间件函数来提取 token，避免重复代码
const checkToken = (req) => {
    // 1. 从请求头获取 token，通常前端会放在 'authorization' 字段中
    const token = req.headers['authorization'];
    
    // 2. 如果前端加上了 'Bearer ' 前缀，可以用 split 去除（可选）
    const realToken = token && token.split(' ')[1];
    
    return realToken; // 返回 token，如果没有则为 undefined
};

module.exports = function(app) {
    // 应用 token 处理中间件（在所有路由之前）
    // app.use(handleToken);
    
    // 验证是否注册
    app.post("/isRegister", (req, res) => {
        serve.isRegister(req, res);
    });
    
    // 注册
    app.post("/register", (req, res) => {
        serve.insertUser(req, res);
    });
    
    // 登录
    app.post("/login", (req, res) => {
        serve.signin(req, res);
    });
    
    // 新建文章
    app.post("/createArticle", (req, res) => {
        if (checkToken(req)) {
            serve.createArticle(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 获取文章
    app.post("/article", (req, res) => {
        if (checkToken(req)) {
            serve.getArticle(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 文章发布
    app.post("/changeArticleState", (req, res) => {
        if (checkToken(req)) {
            serve.changeArticleState(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
       // 更新文章
    app.post("/updateArticle", (req, res) => {
        if (checkToken(req)) {
            serve.updateArticle(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    // 获取文章详情
    app.post("/gainArticle", (req, res) => {
        if (checkToken(req)) {
            serve.gainArticle(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 文章删除
    app.post("/deleteArticle", (req, res) => {
        if (checkToken(req)) {
            serve.deleteArticle(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 文章状态
    app.post("/articleState", (req, res) => {
        if (checkToken(req)) {
            serve.articleState(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 新建分组
    app.post("/addSubset", (req, res) => {
        if (checkToken(req)) {
            serve.addSubset(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
       // 获取分组
    app.get("/subset", (req, res) => {
        
        if (checkToken(req)) {
            serve.getSubset(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    // 修改分组名称
    app.post("/updateSubset", (req, res) => {
        if (checkToken(req)) {
            serve.updateSubset(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 分组删除
    app.post("/deleteSubset", (req, res) => {
        if (checkToken(req)) {
            serve.deleteSubset(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 获取标签
    app.post("/label", (req, res) => {
        if (checkToken(req)) {
            serve.getLabel(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 新建标签
    app.post("/addLabel", (req, res) => {
        if (checkToken(req)) {
            serve.addLabel(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
    // 删除标签
    app.post("/deleteLabel", (req, res) => {
        if (checkToken(req)) {
            serve.deleteLabel(req, res);
        } else {
            res.send({ code: 300 });
        }
    });
    
 
};