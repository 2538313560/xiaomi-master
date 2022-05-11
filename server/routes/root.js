var express = require('express');
var router = express.Router();
var Carousel = require('../models/carousels');
var Goods = require('../models/goods');
const path = require('path');

// 文件上传中间件
const multer = require('multer')
const upload = multer({ dest: path.resolve('server/static') })
// 图片上传接口
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file
  file.url = `http://localhost:3000/static/${file.filename}`
  res.send(file)
})

module.exports = router;