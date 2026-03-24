const db = require("./db")

// 查询数据库是否有注册用户
exports.isRegister=()=>{
    let _sql = "select count(*) as count from users;"
    return db.query2(_sql)
}

// 注册用户
exports.insertUser=(value)=>{
    let _sql = "insert into users set ?;"
    return db.query2(_sql,value)
}

// 登录
exports.signin=(username)=>{
    let _sql = 'SELECT * FROM users WHERE username = ?';
    return db.query2(_sql, [username]);
};