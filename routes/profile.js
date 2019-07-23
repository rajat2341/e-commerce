var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('../config/login_passport');
var morgan = require('morgan');
var login = require('../models/user');
var multer = require('multer');
var path = require('path');

router.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
    // console.log(req.user.username);
    // console.log("**************");
    // console.log(req.session.user);
    // console.log("8******");
    if(req.session.user){
        res.render('profile', {user: req.session.user});
    } else {
        res.render('profile', {user: req.user});
    }
    });

module.exports = router;