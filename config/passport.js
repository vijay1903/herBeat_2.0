// config/passport.js

// load all the things we need
var express = require('express');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

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
        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        connection.query("SELECT * FROM users WHERE username = ? ",[username], function(err, rows){
            done(err, rows[0]);
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
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
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
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
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

    var FACEBOOK_APP_ID = '2128017430559956';
    var FACEBOOK_APP_SECRET ='d311a2aee4167e4d1d52729af463c14e';
    var fbOpts = {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileFields: ['emails'],
        passReqToCallback : true
    };
    var fbOpts2 = {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:8080/signup/facebook/callback',
        passReqToCallback : true,
        profileFields: ['emails']
    };


    // var fbCallback = function(accessToken, refreshToken, profile, cb){
    //     console.log(accessToken, refreshToken, profile);
    // };

    // passport.use(new FacebookStrategy(fbOpts, fbCallback));


    passport.use('facebook-signup', new FacebookStrategy(fbOpts2,
        function(req, accessToken, refreshToken, profile, done) {
            console.log(accessToken, refreshToken, profile);
        //   process.nextTick( function() {
              // find a user whose facebook id is the same as the recieved facebook id
            // we are checking to see if the  facebook user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[profile.displayName], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'You are already registered. Please login.'));
                    //redirect('/login')
                } else {
                    // if there is no facebook user id with that id
                    // create the facebook user
                    var newUserMysql = {
                        facebook_id: profile.id,
                        facebook_token: accessToken,
                        username: profile.displayName,
                        password: bcrypt.hashSync(profile.emails[0].value, null, null)  // use the generateHash function in our user model
                    };
                    var insertQuery = "INSERT INTO users (facebook_id, username, password, facebook_token) values (?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.facebok_id, newUserMysql.username, newUserMysql.password, newUserMysql.facebook_token],
                        function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                    // redirect('/login');
                }
            });
          })
        // })
      );


    
    passport.use('facebook-login', new FacebookStrategy(fbOpts,
    function(req, accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
    // process.nextTick( function() {
        connection.query("SELECT * FROM users WHERE facebook_id = ?",[profile.id], function(err, rows){//search facebook user in database
            if (err) //check for error
                return done(err);
            if (!rows.length) { //if user is not found
                return done(null, false, req.flash('loginMessage', 'You are not registered please signup first.')); // req.flash is the way to set flashdata using connect-flash
                // redirect to signup page
                // redirect('/signup');
            }
            // all is well, return successful user
            return done(null, rows[0]);
        });
    })
    // })
);

    // passport.use(new TwitterStrategy({
    //     consumerKey: TWITTER_CONSUMER_KEY,
    //     consumerSecret: TWITTER_CONSUMER_SECRET,
    //     callbackURL: "http://localhost:8080/auth/twitter/callback"
    //   },
    //   function(token, tokenSecret, profile, done) {
        
    //   }
    // ));

    // passport.use(new GoogleStrategy({
    //     consumerKey: GOOGLE_CONSUMER_KEY,
    //     consumerSecret: GOOGLE_CONSUMER_SECRET,
    //     callbackURL: "http://localhost:8080/auth/google/callback"
    //   },
    //   function(token, tokenSecret, profile, done) {
    //       User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //         return done(err, user);
    //       });
    //   }
    // ));
}
