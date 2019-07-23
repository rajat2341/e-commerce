var express = require('express');
var router = express.Router();
var product = require('../models/products');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var login = require('../models/user');
var arr = [];

var storage = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null,'./public/uploads/')},
    filename: function(req, files, cb){
        var pname = files.fieldname + '-' + Date.now() + path.extname(files.originalname);
        arr.push(pname);
        cb(null, pname);
    }
});

var upload = multer({
    storage: storage
});


router.get('/addProducts', function (req,res) {
    console.log(req.user);
    res.render('admin/addProducts',{user: req.user});
});

router.post('/addProducts',upload.array('myImages'), function (req,res) {
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.quantity) {
        req.flash("msg", "fill all the details");
        res.locals.messages = req.flash();
        res.redirect('/admin/profile');
    } else {
        var name = req.body.name;
        product.findOne({name: name}, function (err, Product) {
            if (err) throw (err);
            if (Product) {
                req.flash("msg", "The product " + Product + " is already in the Store!");
                res.locals.messages = req.flash();
                res.render('admin/addProducts',{user: req.user});
            }
            else {
                var newProduct = new product({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    avatar: arr
                });
                newProduct.save(function (err) {
                    if (err) throw err;
                });
                arr = [];
                req.flash("msg", "New product " + product + " is added in the Store!");
                res.locals.messages = req.flash();
                res.redirect('/admin/profile');
            }
        });
    }
});

router.get('/editProducts', function (req,res) {
    console.log(req.user);
    res.render('admin/editProducts',{user: req.user});
});

router.post('/editProducts', function(req,res) {
    if(req.body.name){
        var name = req.body.name;
        product.findOne({name: name}, function (err, Product){
            if(err) throw (err);
            if(Product){
                if(req.body.description)
                    Product.description = req.body.description;
                if(req.body.price)
                    Product.price = req.body.price;
                if(req.body.quantity)
                    Product.quantity = req.body.quantity;
                Product.save(function (err) {
                    if(err) throw err;
                })
                res.redirect('/admin/profile');
            }
        });
    }

});

router.get('/profile',function (req,res) {
    if(req.session.user){
        res.render('admin/profile',{user: req.session.user});
    }
    else{
        res.render('admin/profile',{user: req.user});
    }
});

router.post('/profile', function (req,res) {
    res.redirect('/');
});

router.get('/usermgmt', function (req,res) {
    login.find({}, function (err, users) {
         if (err) throw err;
         if(users){
             console.log(users);
             res.render('admin/usermgmt',{collection: users, user: req.user});
         }
    });
});

router.get('/changeRole', function (req,res) {
    console.log(req.query);
   login.findOne({_id: req.query.id}, function (err, user) {
        if(err) throw err;
        if(user){
            if(user.role == 'admin'){
                user.role = 'user';
            }
            else{
                user.role = 'admin';
            }
        }
        user.save(function (err) {
           if(err) throw err;
        });
        res.send("ok");
   });
});

module.exports = router;


