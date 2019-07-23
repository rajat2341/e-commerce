var express = require('express');
var router = express.Router();
var product = require('../models/products');

/* GET home page. */
router.get('/', function(req, res) {
    product.find({}).exec(function (err,Product) {
        if(err) throw err;
        console.log(req.session.user);
        if(req.session.user == "undefined")
            res.render('index',{collection: Product});
        else
            res.render('index',{collection: Product,user: req.session.user});
    });
});

module.exports = router;
