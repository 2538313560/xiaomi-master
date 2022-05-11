module.exports = app => {
  const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;  
  
  //连接MongoDB数据库
  mongoose.connect('mongodb://127.0.0.1:27017/vue_xiaomi', {useMongoClient: true});

  mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
  });

  mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
  });

  mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected.")
  });

}