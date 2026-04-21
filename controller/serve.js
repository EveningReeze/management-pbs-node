const dbModle = require("../model/db_model")
const jwt = require("../lib/jwt")
const BASE_URL = 'http://localhost:3000';
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


// 获取文章
// exports.getArticle=async (req,res)=>{
//     let data = req.body
//     let count = -1
//     await dbModle.getArticlePage(data.pageSize, data.nowPage, data.state, data.subsetId, data.serchTerm).then( async(result)=>{
//          // 核心修改：遍历结果，拼接图片路径
//             const formattedResults = result.map(item => {
//                 if (item.cover) {
//                     // 判断是否已经是完整路径，防止重复拼接
//                     if (!item.cover.startsWith('http')) {
//                         // 拼接规则：基础地址 + 第一步设置的虚拟路径 + 文件名
//                         item.cover = `${BASE_URL}/uploads/${item.cover}`;
//                     }
//                 }
//                 return item;
//             });
//            res.send({
//                 code:200,
//                 message:"查询成功",
//                 data:{
//                    count:result.length,
//                    result:formattedResults 
//                 }
//             })
       
//     })
// }
exports.getArticle = async (req, res) => {
    // 1. 接收参数
    // searchTerm 用于全局搜索标题和简介
    let { searchTerm, subsetId, label } = req.body;

    // 2. 数据清洗：将空字符串转为 undefined，确保能触发“查询全部”逻辑
    if (searchTerm === "") searchTerm = undefined;
    if (subsetId === "" || subsetId === null) subsetId = undefined;
    if (label === "") label = undefined;

    try {
        // 3. 调用 Model 层
        const result = await dbModle.getArticlePage(searchTerm, subsetId, label);

        // 4. 图片路径拼接
        const formattedResults = result.map(item => {
            if (item.cover && !item.cover.startsWith('http')) {
                item.cover = `${BASE_URL}/uploads/${item.cover}`;
            }
            return item;
        });

        // 5. 返回结果
        res.send({
            code: 200,
            message: "查询成功",
            data: {
                count: formattedResults.length,
                result: formattedResults
            }
        });

    } catch (error) {
        console.error('查询失败:', error);
        res.status(500).send({
            code: 500,
            message: "服务器错误",
            error: error.message
        });
    }
};

// 发布文章
exports.changeArticleState =async(req,res)=>{
    let data=req.body
    await dbModle.changeArticleState(data.articleId,data.state).then(async()=>{
        res.send({
            code:200,
            message:"文章发布成功",
            data:{}
        })
    })
}
// 删除文章
exports.deleteArticle =async(req,res)=>{
    let data=req.body
    await dbModle.deleteArticle(data.articleId).then(async()=>{
        res.send({
            code:200,
            message:"文章删除成功",
            data:{}
        })
    })
}
// 发布文章
exports.articleState =async(req,res)=>{
    let data=req.body
    let publish = await dbModle.articleCount(1,-1,"")
    let uppublish = await dbModle.articleCount(0,-1,"")
    res.send({
        code:200,
        message:"查询文章状态成功",
        data:{
           result: [
        {
           id:0,
           name:"未发布",
           value:uppublish[0].count
        },
         {
           id:1,
           name:"已发布",
           value:publish[0].count
        },
    ]
        }
    })
}

// 新建分组
exports.addSubset=async (req,res)=>{
    let data = req.body
    await dbModle.addSubset(data).then(()=>{
        res.send({
            code:200,
            message:"添加成功",
            data:{}
        })
    })
}

// 获取分组
exports.getSubset =async(req,res)=>{
    
    await dbModle.getSubset().then(async(result)=>{
        res.send({
            code:200,
            message:"获取分组成功",
            data:result
        })
    })
}

// 修改分组名称
exports.updateSubset=async (req,res)=>{
    let data = req.body
    await dbModle.updateSubset(data.subsetID,data.subsetName).then(()=>{
        res.send({
            code:200,
            message:"修改成功",
            data:{}
        })
    })
}

// 删除分组
exports.deleteSubset =async(req,res)=>{
    let data=req.body
    await dbModle.deleteSubset(data.subsetID).then(async()=>{
        res.send({
            code:200,
            message:"分组删除成功",
            data:{}
        })
    })
}

// 获取标签
exports.getLabel =async(req,res)=>{
    await dbModle.getLabel().then(async(result)=>{
        res.send({
            code:200,
            message:"获取标签成功",
            data:result
        })
    })
}
// 新建标签
exports.addLabel=async (req,res)=>{
    let data = req.body
    await dbModle.addLabel(data).then(()=>{
        res.send({
            code:200,
            message:"添加成功",
            data:{}
        })
    })
}
// 删除标签
exports.deleteLabel =async(req,res)=>{
    let data=req.body
    await dbModle.deleteLabel(data.labelID).then(async()=>{
        res.send({
            code:200,
            message:"标签删除成功",
            data:{}
        })
    })
}


// 获取文件
exports.getFile=async (req,res)=>{
    let data = req.body
    let count = -1
    await dbModle.getFile(data.pageSize, data.nowPage, data.state, data.subsetId).then( async(result)=>{
        if (data.count) {
            const c = await dbModle.fileCount(data.subsetId)
            count= c[0].count
        }
           res.send({
                code:200,
                message:"查询成功",
                data:{
                   count,
                   result 
                }
            })
       
    })
}
//新建文件uploadFile
exports.uploadFile = async (data, res) => {
  await dbModle.uploadFile(data).then((result) => {
    let value = {
      ...data,
      ...{
        id: result.insertId
      }
    }

    res.send({
      code: 200,
      message:"上传成功",
      data: value
    })
  })
}

// 新建文章
exports.createArticle = async (req,res)=>{
    let data = req.body
    if (data.label) {
        data.label=data.label.join(",")
    }
    await dbModle.createArticle(data).then(()=>{
        res.send({
            code:200,
            message:"添加成功",
            data:{}
        })
    })
}

// 获取文章详情
exports.gainArticle = async (req,res)=>{
    let data = req.body
    await dbModle.gainArticle(data.id).then((result)=>{
        res.send({
            code:200,
            message:"查询成功",
            data:result
        })
    })
}

// 编辑文章
exports.updateArticle =  async (req,res)=>{
    let data = req.body
    await dbModle.updateArticle(data.id).then((result)=>{
        res.send({
            code:200,
            message:"编辑成功",
            
        })
    })
}