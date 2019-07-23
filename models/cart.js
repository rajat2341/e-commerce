var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/college', { useNewUrlParser: true });

var cartSchema = mongoose.Schema({
    product_id: String,
    name: String,
    price: String,
    total_price : String,
    quantity: String,
    avatar: String
});

var cart = mongoose.model('cart', cartSchema);

module.exports = cart;