var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('../config/login_passport');
var morgan = require('morgan');
var login = require('../models/user')


router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.redirect('/register')
    } else {
        var name = req.body.username;
        login.findOne({username: name}, function (err, user) {
            if (err) throw (err);
            if (user) {
                req.flash("msg","The user with name " + name + " is already in use!");
                res.locals.messages = req.flash();
                res.render('register');
            }
            else {
                var newUser = new login({username: req.body.username, password: req.body.password, avatar: 'noor.jpg',role: 'user'});
                newUser.save(function (err) {
                    if (err) throw err;
                });
                req.session.user = newUser;
                res.redirect('/profile');
            }
        });
    }
});

module.exports = router;