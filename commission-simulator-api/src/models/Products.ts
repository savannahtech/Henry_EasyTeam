const _product = require('mongoose');

const productSchema = new _product.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  }
});

module.exports = _product.model('Product', productSchema);
