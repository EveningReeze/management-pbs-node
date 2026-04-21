const jwt = require("jsonwebtoken");

const secret = "abjfwagncsckaiowascoiafshisuohalkfbcjkb";

// 生成token
exports.generateToken = function(e) {
    let payload = { id: e, time: new Date() };
    let token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 30 });
    return token;
}

// 验证token（同步版本，修复原异步问题）
exports.verifyToken = function(token) {
    try {
        const decoded = jwt.verify(token, secret);
        return { valid: true, data: decoded };
    } catch (err) {
        return { valid: false, message: err.message };
    }
}

// 从请求中提取token（新增）
exports.extractToken = function(req) {
    // 1. 先从 body 中获取
    if (req.body && req.body.token) {
        return req.body.token;
    }
    
    // 2. 从请求头中获取
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // 支持 Bearer token 格式
        if (authHeader.startsWith('Bearer ')) {
            return authHeader.slice(7);
        }
        // 直接返回 token
        return authHeader;
    }
    
    // 3. 从 query 参数中获取
    if (req.query && req.query.token) {
        return req.query.token;
    }
    
    return null;
}