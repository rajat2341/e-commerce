var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('../config/login_passport');
var morgan = require('morgan');
var login = require('../models/user');
var multer = require('multer');
var path = require('path');


var storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req,files,cb) {
        cb(null, files.fieldname + '-' + Date.now() + path.extname(files.originalname));
    }
});

var upload = multer({
    storage: storage
}).any();


router.post('/dp', function (req,res) {
    console.log(req.user);
    upload(req,res, function (err) {
        if(err) throw err;
        login.findOne({username: req.user.username},function (err, user) {
            if(err) throw err;
            if(user){
                if(req.files[0].filename)
                    user.avatar = req.files[0].filename;
                user.save(function (err) {
                    if (err) throw err;
                });
                if(req.user.role == 'admin') {
                    res.redirect('/admin/profile');
                }
                else{
                    res.render('profile',{user: req.user});
                }
            }
        });
    })
});

module.exports = router;