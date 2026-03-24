const serve = require("../controller/serve")

module.exports =function(app){

// 验证是否注册
app.post("/isRegister",(req,res)=>{
    serve.isRegister(req,res)
})
// 注册
app.post("/register",(req,res)=>{
    // serve.isRegister(req,res)
    serve.insertUser(req,res)
})
// 登录
app.post("/login",(req,res)=>{
    serve.signin(req,res)
})
}