var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('../config/login_passport');
var morgan = require('morgan');
var cart = require('../models/cart');


router.get('/logout',
    function (req, res) {
        req.logout();
        cart.remove({},function (err) {
            if (err) throw err;
        });
        req.session.destroy( function (err) {
            if(err) throw err;
        });
        res.redirect('/');
    });

module.exports = router;