const dbModle = require("../model/db_modle")
const jwt = require("../lib/jwt")
exports.isRegister= async (req,res)=>{
    await dbModle.isRegister().then((result)=>{
        let code = 400
        if (result[0].count>0) {
            code=200
        }
        res.send({
            code:code
        })
    })
}

// 注册
exports.insertUser=async (req,res)=>{
    let data = req.body
    await dbModle.isRegister(data).then((result)=>{
        res.send({
            code:200
        })
    })
}

// 登录
exports.signin=async (req,res)=>{
    let data = req.body
    await dbModle.signin(data.name).then((result)=>{
        if (result.length>0&&data.pwd==result[0].password) {
            
            let token = jwt.generateToken(data.name)
            let message={
                ...result,
                ...{token:token}
            }
            res.send({
                code:200,
                data:message
            })
        }
    })
}
