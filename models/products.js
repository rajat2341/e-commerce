var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/college', { useNewUrlParser: true });

var productSchema = mongoose.Schema({
    product_id: String,
   name: String,
   description: String,
   price: String,
   quantity: String,
    avatar: [String]
});

var product = mongoose.model('product', productSchema);

module.exports = product;