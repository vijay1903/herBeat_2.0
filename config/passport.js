// config/passport.js

// load all the things we need
var express = require('express');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows){
            if(err){
                console.log(err);
                return done(null, err);
            }
            done(null, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses email and password, we will override with email
            emailField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUserMysql = {
                        email: email,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.email, newUserMysql.password],function(err, rows) {
                        // console.log("rows = "+rows);
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses email and password, we will override with email
            emailField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

    var FACEBOOK_APP_ID = 'get_your_own';
    var FACEBOOK_APP_SECRET ='get_your_own';
    var fbOpts = {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileFields: ['emails','id', 'name', 'gender', 'displayName'],
        passReqToCallback : true
    };

    passport.use('facebook', new FacebookStrategy(fbOpts,
        function(req, accessToken, refreshToken, profile, done) {
            console.log('FB accessToken : ', accessToken, ' FB refreshToken: ', refreshToken, ' FB profile : ', profile);
        
            connection.query("SELECT * FROM users WHERE facebook_id = ?", profile.id, function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, rows[0]);
                    
                } else {
                    // if there is no facebook user id with that id
                    // create the facebook user
                    var newUserMysql = {
                        facebook_id: profile.id,
                        name: profile.displayName,
                        facebook_token: accessToken,
                        email: profile.emails[0].value,
                        provider: profile.provider,
                        password: bcrypt.hashSync(profile.emails[0].value, null, null)  // use the generateHash function in our user model
                    };
                    console.log("newUser Facebook details : ");
                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO users (facebook_id, name, email, password, facebook_token, provider) values (?,?,?,?,?,?)";
                    // connection.query(insertQuery,[newUserMysql.facebook_id, newUserMysql.name, newUserMysql.email, newUserMysql.password, newUserMysql.facebook_token, newUserMysql.provider]);
                    connection.query(insertQuery,[newUserMysql.facebook_id, newUserMysql.name, newUserMysql.email, newUserMysql.password, newUserMysql.facebook_token, newUserMysql.provider],
                        function(err, rows) {
                            // console.log("rows = "+rows);
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
          })
        // })
      );

    var TWITTER_CONSUMER_KEY = 'get_your_own';
    var TWITTER_CONSUMER_SECRET = 'get_your_own' ;
    passport.use('twitter', new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:8080/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
          
            console.log(' Tw token : ',token, ' Tw tokenSecret : ', tokenSecret, ' Tw profile : ', profile);
        
            connection.query("SELECT * FROM users WHERE twitter_id = ?", profile.id, function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, rows[0]);
                    
                } else {
                    // if there is no titter user id with that id
                    // create the twitter user
                    var newUserMysql = {
                        twitter_id: profile.id,
                        name: profile.displayName,
                        twitter_token: token,
                        provider: profile.provider,
                        // email: profile.emails[0].value,
                        password: bcrypt.hashSync(profile.id, null, null)  // use the generateHash function in our user model
                    };
                    console.log("newUser Twitter details : ");
                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO users (twitter_id, name, password, twitter_token, provider) values (?,?,?,?,?,?)";
                    // connection.query(insertQuery,[newUserMysql.twitter_id, newUserMysql.name, newUserMysql.password, newUserMysql.twitter_token, newUserMysql.provider]);
                    connection.query(insertQuery,[newUserMysql.twitter_id, newUserMysql.name, newUserMysql.password, newUserMysql.twitter_token, newUserMysql.provider],
                        function(err, rows) {
                        // console.log("rows = "+rows);
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
      }
    ));

    var GOOGLE_CLIENT_ID = 'get_your_own',
    GOOGLE_CLIENT_SECRET = 'get_your_own',
    oauth_callback = "https://api.twitter.com/oauth/request_token";

    passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"        
      },
      function(accessToken, refreshToken, profile, done) {
            console.log('G+ accessToken : ', accessToken, ' G+ refreshToken : ', refreshToken," G+ profile : ", profile);

            connection.query("SELECT * FROM users WHERE google_id = ?", profile.id, function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, rows[0]);
                    
                } else {
                    // if there is no google user id with that id
                    // create the google user
                    var newUserMysql = {
                        google_id: profile.id,
                        name: profile.displayName,
                        google_token: accessToken,
                        email: profile.emails[0].value,
                        provider: profile.provider,
                        password: bcrypt.hashSync(profile.id, null, null)  // use the generateHash function in our user model
                    };
                    console.log("newUser Google details : ");
                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO users (google_id, name, email, password, google_token, provider) values (?,?,?,?,?,?)";
                    // connection.query(insertQuery,[newUserMysql.google_id, newUserMysql.name newUserMysql.password, newUserMysql.google_token, newUserMysql.provider]);
                    connection.query(insertQuery,[newUserMysql.google_id, newUserMysql.name, newUserMysql.email, newUserMysql.password, newUserMysql.google_token, newUserMysql.provider],
                        function(err, rows) {
                            // console.log("rows = "+rows);
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
      }
    ));
}
