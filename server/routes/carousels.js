var express = require('express');
var router = express.Router();
var Carousel = require('../models/carousels');

//查询轮播图接口
router.get('/carousel', async (req, res) => {
  const items = await Carousel.find()
  res.send(items)
})
// 删除轮播图接口
router.post('/deleteCarousel', async (req, res) => {
  const items = await Carousel.deleteOne({ _id: req.body.id })
  res.send(items)
})
// 新增轮播图接口
router.post('/addCarousel', async (req, res) => {
  // 截取url的末尾
  const lastItem = req.body.form.imgUrl.substring(req.body.form.imgUrl.lastIndexOf('/') + 1)
  const items = await Carousel.create({ productName: req.body.form.name, productImage: lastItem })
  res.send(items)
})
//  编辑轮播图接口
router.post('/updateCarousel', async (req, res) => {
  // 截取url的末尾
  const lastItem = req.body.form.imgUrl.substring(req.body.form.imgUrl.lastIndexOf('/') + 1)
  const items = await Carousel.findByIdAndUpdate(req.body.id, { productName: req.body.form.name, productImage: lastItem })
  res.send(items)
})

module.exports = router;
