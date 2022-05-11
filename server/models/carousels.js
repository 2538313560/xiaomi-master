var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var carouselSchema = new Schema({
  "productName": { type: 'string' },
  "productImage": { type: 'string' }
});

module.exports = mongoose.model('Carousel', carouselSchema);
