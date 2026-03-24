const dbModle = require("../model/db_model")
const jwt = require("../lib/jwt")
exports.isRegister= async (req,res)=>{
    await dbModle.isRegister().then((result)=>{
        let code = 300
        let message="验证失败"
        if (result[0].count>0) {
            code=200
            message="验证成功"
        }
        res.send({
            code:code,
            message:message,
            data:{}
        })
    })
}

// 注册
exports.insertUser=async (req,res)=>{
    let data = req.body
    await dbModle.insertUser(data).then((result)=>{
        res.send({
            code:200,
            message:"注册成功",
            data:{}
        })
    })
}

// 登录
exports.signin=async (req,res)=>{
    let data = req.body
    await dbModle.signin(data.username).then((result)=>{
        
        if (result.length>0&&data.password==result[0].password) {
            
            let token = jwt.generateToken(data.name)
            let userinfo={
                id:result[0].id,
                name:result[0].name,
                username:result[0].username,
                ...{token:token}
            }
            res.send({
                code:200,
                message:"登录成功",
                data:userinfo
            })
        }else{
             res.send({
                code:201,
                message:"登录失败,未查询到账号信息，请注册",
            })
        }
    })
}
