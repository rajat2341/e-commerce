var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var login = require('../models/user')
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new Strategy(
    function (username, password, done) {
        login.findOne({username: username}, function (err, user) {
            // console.log(user);
            if (err) {
                return (done(err));
            }
            else if (!user) {
                return done(null, false);
            }
            else if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));


// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
//
// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    login.findById(id, function(err, user) {
        done(err, user);
    });
});


module.exports = passport;

//-------------------------------------------------------------
//facebook login

passport.use(new FacebookStrategy({
        clientID: '445589235907356',
        clientSecret: '8cb55891e79ff2e5c961ccc8635081f8',
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        // profileURL    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        //callbackURL: "http://localhost:3000"
        profileFields: ['displayName'],

        passReqToCallback : true // NEED THIS!!

    },
    function(req, accessToken, refreshToken, profile, done) {
        // console.log(profile);
            login.findOne({'Id': profile.id}, function(err, user) {
                if (err) { return done(err); }
                if(user) {
                    // user.facebookID = profile.id;
                    // user.facebookToken = accessToken;
                    // user.save();
                    return done(null, user);
                }
                else{
                    var newUser = new login();
                    newUser.Id = profile.id,
                    newUser.facebook.Token = accessToken,
                    newUser.username = profile.displayName;
                    newUser.avatar = 'noor.jpg',
                    newUser.role = 'user';

                    newUser.save(function (err) {
                        if (err) return err;
                    });
                    return done(null, newUser);
                }
            });
        }
));


//------------------------------------------------------------------------------
// google login


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID: '647847013028-isfvu1ru60mb46bitt9bcbnoov8mpfkp.apps.googleusercontent.com',
        clientSecret: 'jwufgJ_HZO7lH8Ew_4PApL1m',
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
    console.log(profile);
        login.findOne({ 'Id': profile.id }, function (err, user) {
            if(err)
                return done(err);
            if(user) {
                return done(null, user);
            }else{
                var newUser = new login();
                // newUser.username = profile.displayName,
                newUser.Id = profile.id,
                newUser.google.Token = accessToken,
                newUser.username = profile.displayName,
                newUser.avatar = profile.photos[0].value.slice(0, -6),
                newUser.role = "user";

                newUser.save(function (err) {
                    if (err) return err;
                });
                return done(null, newUser);
            }
        });
    }
));