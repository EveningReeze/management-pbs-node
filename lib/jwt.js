const jwt = require("jsonwebtoken");

const secret = "abjfwagncsckaiow";

// 生成token

exports.generateToken=function (e) {
    let paylond = {id:e,time:new Date()};
    let toekn = jwt.sign(paylond,secret,{expiresIn:60*60*24*30})
    return toekn
}

// 验证token
exports.verifyToken=function(e){
    let paylond;
    jwt.verify(e,secret,function (err,result) {
        if(err){
            paylond=0

        }else{
            paylond=1
        }
    })
    return paylond;
}