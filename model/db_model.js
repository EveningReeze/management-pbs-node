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

// 获取文章
exports.getArticlePage = async (searchTerm, subsetId, label) => {
  let _sql = 'SELECT * FROM article WHERE 1=1';
  let params = [];

  // 1. 处理搜索词 (匹配 title 或 introduce)
  if (searchTerm) {
    // 关键点：必须加括号，将 OR 条件包裹起来
    // 逻辑：(标题包含搜索词 OR 简介包含搜索词)
    _sql += ' AND (title LIKE ? OR introduce LIKE ?)';
    // 参数需要传两次，分别对应两个 LIKE
    params.push(`%${searchTerm}%`);
    params.push(`%${searchTerm}%`);
  }

  // 2. 处理分类筛选
  if (subsetId !== undefined) {
    _sql += ' AND subset_id = ?';
    params.push(subsetId);
  }

  // 3. 处理标签筛选
  if (label) {
    _sql += ' AND label LIKE ?';
    params.push(`%${label}%`);
  }

  // 4. 排序
  _sql += ' ORDER BY id DESC';

  return db.query2(_sql, params);
};
// 查询总数
exports.articleCount = async (state, subsetId, serchTerm) => {
  let _sql = '';
  let params = [];
  
  if (serchTerm) {
    _sql = `SELECT COUNT(*) as total FROM article WHERE CONCAT(title, introduce) LIKE ?`;
    params = [`%${serchTerm}%`];
  } else if (state > -1 && subsetId > -1) {
    _sql = `SELECT COUNT(*) as total FROM article WHERE subset_id = ? AND state = ?`;
    params = [subsetId, state];
  } else if (state > -1) {
    _sql = `SELECT COUNT(*) as total FROM article WHERE state = ?`;
    params = [state];
  } else {
    _sql = `SELECT COUNT(*) as total FROM article`;
  }
  
  return db.query2(_sql, params);
};

//文章发布
exports.changeArticleState = (id,state)=>{
    let _sql=`update article set state="${state}" where id="${id}"`
     return db.query2(_sql)
}

//删除文章
exports.deleteArticle = (id,state)=>{
    let _sql=`delete from article  where id="${id}"`
     return db.query2(_sql)
}

//新建分组
exports.addSubset = (value)=>{
  
  let _spl = 'INSERT INTO subset SET ?';
  return db.query2(_spl,value)
}

//获取分组
exports.getSubset = (classify)=>{
  let _spl = `select * from subset ;`
  return db.query2(_spl)
}

//修改分组名称
exports.updateSubset = (id,name)=>{
  let _spl = `update subset set subset_name="${name}" where id="${id}";`
  return db.query2(_spl)
}

//删除分组
exports.deleteSubset = (id,state)=>{
    let _sql=`delete from subset  where id="${id}"`
     return db.query2(_sql)
}

//新建标签
exports.addLabel = (value)=>{
  let _spl = 'INSERT INTO label SET ?';
  return db.query2(_spl,value)
}
//获取标签
exports.getLabel = ()=>{
  let _spl = `select * from label ;`
  return db.query2(_spl)
}

//删除标签
exports.deleteLabel = (id,state)=>{
    let _sql=`delete from label  where id="${id}"`
     return db.query2(_sql)
}

//获取文件
exports.getFile = (pageSize, nowPage, subsetId) => {
    let _sql;
    if (subsetId > -1 && typeof subsetId == 'number') {
        _sql = `select * from file where subset_id="${subsetId}" order by id desc limit ${(nowPage - 1) * pageSize},${pageSize}`;
    } else if (typeof subsetId == 'string') {
        _sql = `select * from file where subset_id not in ("${subsetId}") order by id desc limit ${(nowPage - 1) * pageSize},${pageSize}`;
    } else {
        _sql = `select * from file order by id desc limit ${(nowPage - 1) * pageSize},${pageSize}`;
    }
    return db.query2(_sql)
}

//新建文件uploadFile
exports.uploadFile = (value) => {
    let _sql = "insert into file set ?;"
    return db.query2(_sql, value)
}

//查询文件总数
exports.fileCount = (subsetId) => {
    let _sql;
    if (subsetId > -1 && typeof subsetId == 'number') {
        _sql = `select count(*) as count from file where subset_id="${subsetId}"`;
    } else if (typeof subsetId == 'string') {
        _sql = `select count(*) as count from file where subset_id not in ("${subsetId}")`;
    } else {
        _sql = s`elect count(*) as count from file`;
    }
    return db.query2(_sql)
}


// 新建文章
exports.createArticle = (value) => {
    let _spl = "insert into article set ?;"
  return db.query2(_spl,value)
}

// 获取文章详情

exports.gainArticle = (id)=>{
  let _spl = `select * from article where id="${id}";`
  return db.query2(_spl)
}

// 编辑文章
exports.updateArticle = (id,value) => {
    let _spl = `update article set ? where id="${id}";`
  return db.query2(_spl,value)
}
