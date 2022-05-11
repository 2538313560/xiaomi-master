var express = require('express');
var router = express.Router();
var Goods = require('../models/goods');

//查询商品列表数据
router.get("/list", function (req, res, next) {
  // 分页逻辑
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let priceLevel = req.param("priceLevel");
  let sort = req.param("sort");
  let skip = (page - 1) * pageSize;
  var priceGt = '', priceLte = '';
  let params = {};

  // 价格区间排序
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100; break;
      case '1': priceGt = 100; priceLte = 500; break;
      case '2': priceGt = 500; priceLte = 1000; break;
      case '3': priceGt = 1000; priceLte = 5000; break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({ 'salePrice': sort });
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
});

//加入到购物车
router.post("/addCart", function (req, res, next) {
  var userId = '100000077', productId = req.body.productId;
  var User = require('../models/user');

  User.findOne({ userId: userId }, function (err, userDoc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      console.log("userDoc:" + userDoc);
      if (userDoc) {
        var goodsItem = '';

        // 重复添加，则数量加 1
        userDoc.cartList.forEach(function (item) {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum++;
          }
        });

        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: "1",
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          Goods.findOne({ productId: productId }, function (err1, doc) {
            if (err1) {
              res.json({
                status: "1",
                msg: err1.message
              })
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: "1",
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  })
});
// 查询全部商品接口
router.get('/goods', async (req, res) => {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let skip = (page - 1) * pageSize;
  const items = await Goods.find().skip(skip).limit(pageSize);
  res.send(items)
})
// 删除商品接口
router.post('/deleteGoods', async (req, res) => {
  const items = await Goods.deleteOne({ _id: req.body.id })
  res.send(items)
})
// 新增商品接口
router.post('/addGoods', async (req, res) => {
  // 截取url的末尾
  const lastItem = req.body.form.imgUrl.substring(req.body.form.imgUrl.lastIndexOf('/') + 1)
  console.log(parseInt(req.body.form.salePrice));
  const items = await Goods.create({
    productName: req.body.form.name,
    salePrice: parseInt(req.body.form.salePrice),
    productImage: lastItem
  })
  res.send(items)
})
//  编辑商品接口
router.post('/updateGoods', async (req, res) => {
  // 截取url的末尾
  const lastItem = req.body.form.imgUrl.substring(req.body.form.imgUrl.lastIndexOf('/') + 1)
  const items = await Goods.findByIdAndUpdate(req.body.id,
    {
      productName: req.body.form.name,
      salePrice: parseInt(req.body.form.salePrice),
      productImage: lastItem
    })
  res.send(items)
})

module.exports = router;
