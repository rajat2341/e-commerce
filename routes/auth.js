var express = require('express');
var router  = express.Router();
var passport = require('passport');
var google = require('googleapis');
// var OAuth2 = google.auth.oauth2;
var User = require('./../models/user');

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        var user = req.session.user;
        res.redirect('/profile');
    });

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login' }),
    function (req,res) {
        res.redirect('/profile');
    });

module.exports = router;