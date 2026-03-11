// 数据库连接配置文件 db.js
const mysql = require('mysql');      // 导入mysql模块
const config = require('../config/default');  // 导入配置文件

// ==================== 方式一：创建单个数据库连接 ====================
// 使用mysql.createConnection()创建一个直接的数据库连接
// 这种方式适合简单的单次查询，连接建立后需要手动管理
const connection = mysql.createConnection({
    host: config.database.HOST,      // 数据库主机地址
    user: config.database.USER,      // 数据库用户名
    password: config.database.PASSWORD,  // 数据库密码
    // 注意：这里没有指定具体数据库，需要后续使用USE语句切换
});

// 直接链接数据库查询函数
// 使用单个连接执行查询，适用于简单的查询场景
// 注意：这种方式不会自动管理连接，需要手动处理连接的建立和关闭
let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        // 使用 connection 对象执行查询
        connection.query(sql, values, (err, result) => {
            if (err) {
                // 查询出错时拒绝Promise
                reject(err);
            } else {
                // 查询成功时解析Promise并返回结果
                resolve(result);
            }
        });
    });
};

// ==================== 方式二：创建连接池（推荐） ====================
// 使用mysql.createPool()创建连接池
// 连接池管理多个连接，提高性能和并发处理能力
const pool = mysql.createPool({
    connectionLimit: 10,  // 连接池中最大连接数
    host: config.database.HOST,      // 数据库主机地址
    user: config.database.USER,      // 数据库用户名
    password: config.database.PASSWORD,  // 数据库密码
    database: config.database.DB     // 要连接的具体数据库
});


// 通过 pool.getConnection 获得连接
// 使用连接池获取连接执行查询，适用于生产环境
// 优势：自动管理连接，提高性能和并发处理能力
let query2 = (sql, values) => {
    return new Promise((resolve, reject) => {
        // 从连接池获取一个连接
        pool.getConnection((err, connection) => {
            if (err) {
                // 获取连接失败时拒绝Promise
                reject(err);
            } else {
                // 使用获取到的连接执行查询
                connection.query(sql, values, (error, rows) => {
                    if (error) {
                        // 查询出错时拒绝Promise
                        reject(error);
                    } else {
                        // 查询成功时解析Promise并返回结果
                        resolve(rows);
                    }
                    // 释放该连接，把该连接放回池里供其他人使用
                    connection.release();
                    // connection.destroy(); // 如果要关闭连接并将其从池中删除，请改用 connection.destroy()
                });
            }
        });
    });
};

// 数据库创建语句
let xxblog='create database if not exists xxblog default charset utf8 collate utf8_general_ci;'

// 创建数据库
let createDatabase=(db)=>{
    return query(db,[])
}


// 数据表
// 用户表
let users = `
        create table if not exists users(
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL COMMENT '用户名',
            username VARCHAR(50) NOT NULL UNIQUE COMMENT '账号', 
            password VARCHAR(100) NOT NULL COMMENT '密码',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
        );`;

//分组
let subset=`
        create table if not exists subset(
            id INT NOT NULL AUTO_INCREMENT,
            subset_name VARCHAR(100) NOT NULL COMMENT '分类名称',
            classify INT NOT NULL COMMENT '类型0文章,1图片,2资源',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
        );
`;
// 本地文件
let file=`
        create table if not exists file(
            id INT NOT NULL AUTO_INCREMENT,
            url VARCHAR(100) NOT NULL COMMENT '地址',
            file_name VARCHAR(100) NOT NULL COMMENT '名称',
            format VARCHAR(32) NOT NULL COMMENT '格式',
            subset_id INT COMMENT '所属分类',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
        );
`;
// 文章
let article=`
        create table if not exists article(
            id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(200) NOT NULL COMMENT '标题',
            subset_id INT COMMENT '所属分类',
            classify INT NOT NULL COMMENT '类型0文章, 1图片',
            label VARCHAR(200) COMMENT '标签',
            introduce VARCHAR(1000) COMMENT '简介',
            content VARCHAR(5000) COMMENT '内容',
            cover VARCHAR(100) COMMENT '封面地址',
            views INT DEFAULT 0 COMMENT '查看次数',
            state INT DEFAULT 0 COMMENT '文章状态',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
);`;
// 文章点赞
let praise=`
        create table if not exists praise(
            id INT NOT NULL AUTO_INCREMENT,
            user_id VARCHAR(100) NOT NULL COMMENT '用户',
            user_type INT NOT NULL COMMENT '查看次数',
            article_id INT NOT NULL COMMENT '所属文章',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
        );
`;
// 文章评论
let comment=`
        create table if not exists comment(
            id INT NOT NULL AUTO_INCREMENT,
            user_id VARCHAR(100) NOT NULL COMMENT '用户',
            user_type INT NOT NULL COMMENT '用户类型',
            user_name VARCHAR(100) COMMENT '用户名称',
            article_id INT NOT NULL COMMENT '所属文章',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            content VARCHAR(1000) NOT NULL COMMENT '内容',
            complaint INT DEFAULT 0 COMMENT '举报次数',
            isread INT DEFAULT 0 COMMENT '是否已读',
            PRIMARY KEY (id)
);`;
// 标签
let label=`
        create table if not exists label(
            id INT NOT NULL AUTO_INCREMENT,
            label_name VARCHAR(100) NOT NULL COMMENT '名称',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
);`;
// 日记
let diary=`
        create table if not exists diary(
            id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(200) NOT NULL COMMENT '标题',
            content VARCHAR(5000) NOT NULL COMMENT '内容',
            picture VARCHAR(500) COMMENT '图片地址',
            weather_id INT COMMENT '天气',
            mood INT DEFAULT 0 COMMENT '心情',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
);`;
// 天气
let weather=`
        create table if not exists weather(
            id INT NOT NULL AUTO_INCREMENT,
            weather_name VARCHAR(32) NOT NULL COMMENT '名称',
            icon VARCHAR(100) COMMENT '图标',
            PRIMARY KEY (id)
);`;
// 私信
let message=`
        create table if not exists message(
            id INT NOT NULL AUTO_INCREMENT,
            user_id VARCHAR(100) NOT NULL COMMENT '用户',
            user_type INT NOT NULL COMMENT '用户类型',
            user_name VARCHAR(100) COMMENT '用户名称',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            content VARCHAR(1000) NOT NULL COMMENT '内容',
            isread INT DEFAULT 0 COMMENT '是否已读',
            PRIMARY KEY (id)
);`;
// 埋点
let record=`
        create table if not exists record(
            id INT NOT NULL AUTO_INCREMENT,
            user_id VARCHAR(100) NOT NULL COMMENT '用户',
            user_type INT NOT NULL COMMENT '用户类型',
            position VARCHAR(100) COMMENT '位置',
            isread INT DEFAULT 0 COMMENT '设备',
            moment VARCHAR(100) NOT NULL COMMENT '时间',
            PRIMARY KEY (id)
);`;

// 创建数据表

const createTable=(sql)=>{
    return query2(sql,[])
}

// 先创建数据库在创建表
async function create() {
    await createDatabase(xxblog);
    createTable(users);
    createTable(subset);
    createTable(file);
    createTable(article);
    createTable(praise);
    createTable(comment);
    createTable(label); 
    createTable(diary);
    createTable(weather);
    createTable(message);
    createTable(record);
}


// 连接数据库
connection.connect()


create()


// 导出所有可能用到的函数和变量
module.exports = {
    query,      // 相当于 query: query
    query2,
    createDatabase,
    createTable,
    create,
    pool,       // 如果需要直接使用连接池
    connection  // 如果需要直接使用单个连接
};