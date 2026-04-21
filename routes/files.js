const multer = require('multer');
const serve = require("../controller/serve");
const path = require('path');
// 配置存储引擎
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
         cb(null, './data/files'); // 文件存储路径
   },
   filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // 自定义文件名
   }
});
const upload = multer({ storage: storage });

module.exports = function(app) {
// 路由：处理文件和表单字段
 app.post('/upload', upload.single('file'), (req, res) => {
        try {
            // console.log('文件信息:', req.file); // 上传的文件信息
            // console.log('表单字段:', req.body); // 表单中的其他字段
            // 文件已经保存到了 `uploads/` 目录下，并且 `req.file` 包含了文件的信息
            console.log(req.file);
            // res.send('文件上传成功！');
            const file = req.file.originalname.split('.')
            let data = {
                url: req.file.filename,
                file_name: file[0],
                format: file[1],
                moment: new Date(),
            }
           
            serve.uploadFile(data, res)
        } catch (err) {
            res.send({
                code: 400
            })
        }
    });
}
