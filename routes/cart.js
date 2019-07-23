var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cart = require('../models/cart');
var product = require('../models/products');
var i;


router.get('/cart', function (req, res) {
    cart.find({}).exec(function (err,cart) {
        if(err) throw err;
        res.render('cart',{collection: cart, user: req.user});
    });
});

router.get('/cart/addtocart', function (req,res) {
    console.log(req.query);

    var total = req.session.total | 0;
    var tp = req.session.tp | 0;

    product.findOne({_id: req.query.id}, function (err, product) {
        if(err) throw err;
        if(product){
            cart.findOne({product_id: req.query.id}, function (err,prod) {
                if (err) throw err;
                if(!prod){
                    tp = Number(req.query.quantity)*(product.price);
                    req.session.tp = tp;
                    total = Number(total) + tp;
                    req.session.total = total;
                    var cartProd = new cart({
                        product_id: req.query.id,
                        name: product.name,
                        price: product.price,
                        total_price: tp,
                        quantity: req.query.quantity,
                        avatar: product.avatar[0]
                    });
                    cartProd.save(function (err) {
                        if (err) throw err;
                    });
                    req.session.cart = cartProd;
                    res.send("ok");
                } else {
                    tp = req.session.tp;
                    quant = Number(prod.quantity) + Number(req.query.quantity);
                    tp = quant*(product.price);
                    req.session.tp = tp;
                    total = Number(total) + tp;
                    req.session.total = total;
                    prod.total_price = tp,
                    prod.quantity = quant,
                    prod.save(function (err) {
                        if(err) throw err;
                    });
                }
            });
        }
    });
});

router.get('/cart/checkout', function (req,res) {
    total = req.session.total | 0;
    if(Number(total) > 0)
        res.render('checkout',{user: req.user,product: {price: Number(total)}});
    else
        res.redirect('/cart');
});

router.get('/cart/deletebyone', function (req,res) {
    console.log(req.query.id);
    tp = req.session.tp;
    total = req.session.total;


    cart.findOne({product_id: req.query.id}, function (err, product) {
        if(err) throw err;
        if(product) {
            if(product.quantity > 1){
                tp = tp - product.price;
                total = total - product.price;
                var quant = product.quantity - 1;
                if(tp)
                    product.total_price =  tp;
                if(quant)
                    product.quantity = quant;
                product.save(function (err) {
                    if (err) throw err;
                });
                req.session.total = total;
                req.session.cart = product;
                req.session.tp = tp;
                res.send({total_price: req.session.tp,quantity: quant});
            }
            else{
                cart.remove({product_id: req.query.id}, function (err) {
                    if (err) throw err;
                });
            }
        }
    });
});

router.get('/cart/delete', function (req,res) {
    cart.remove({product_id: req.query.id}, function (err) {
        if(err) throw err;
    });
    res.send('ok');
});

module.exports = router;