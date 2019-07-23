var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('../config/login_passport');
var morgan = require('morgan');

router.get('/login', function (req, res) {
    // console.log(req.session.user);
    if(req.session.user){
        if(req.session.user.role == 'admin') {
            res.redirect('/admin/profile');
        }
        else{
            res.redirect('/profile');
        }
    }
    else{
        res.render('login');
    }
});

router.post('/login',
    function(req,res,next){
        next();
    },
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        // console.log(req.user);
        if(req.user.role == 'admin') {
            req.session.user = req.user;
            res.redirect('/admin/profile');
        }
        else{
            req.session.user = req.user;
            res.render('profile',{user: req.user});
        }
    });

module.exports = router;